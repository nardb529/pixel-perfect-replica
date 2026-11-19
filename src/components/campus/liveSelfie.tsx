import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CHALLENGE_PROMPTS,
  ChallengeTracker,
  captureCompressedSelfie,
  isFrontFacing,
  loadLivenessEngine,
  pickChallenges,
  type CompressedSelfie,
  type LivenessChallenge,
  type LivenessEngine,
} from "@/lib/campus/liveness";

export interface LiveSelfieResult {
  selfie: CompressedSelfie;
  challenges: LivenessChallenge[];
  livenessPassedAt: string;
}

type Phase = "idle" | "loading" | "challenge" | "hold" | "review";

const FRAME_INTERVAL_MS = 120;
const CHALLENGE_TIMEOUT_MS = 20000;
const HOLD_FRAMES_NEEDED = 6;

/**
 * Live camera only (no gallery upload). All frames are analysed in memory and
 * discarded. Only the one final, compressed selfie is handed to the parent.
 */
export function LiveSelfieCapture({
  onConfirm,
  disabled = false,
}: {
  onConfirm: (result: LiveSelfieResult) => void;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<LivenessEngine | null>(null);
  const timerRef = useRef<number | null>(null);
  const runRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [prompt, setPrompt] = useState("");
  const [step, setStep] = useState({ index: 0, total: 0 });
  const [error, setError] = useState("");
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<LiveSelfieResult | null>(null);

  const stopAll = useCallback(() => {
    runRef.current += 1;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    engineRef.current?.close();
    engineRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => stopAll, [stopAll]);

  useEffect(() => {
    return () => {
      if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    };
  }, [reviewUrl]);

  function fail(message: string) {
    stopAll();
    setPhase("idle");
    setError(message);
  }

  async function start() {
    setError("");
    setResult(null);
    setReviewUrl(null);
    stopAll();
    const runId = runRef.current;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Your browser cannot open the camera. Try Chrome or Safari, and make sure the page is open from the app or the website (not inside another app).",
      );
      return;
    }

    setPhase("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      if (runRef.current !== runId) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("no video element");
      video.srcObject = stream;
      await video.play();

      const engine = await loadLivenessEngine();
      if (runRef.current !== runId) {
        engine.close();
        return;
      }
      engineRef.current = engine;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        fail(
          "Camera access was blocked. Allow the camera for this site in your browser settings, then try again.",
        );
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        fail("No camera was found on this device.");
      } else {
        fail("We could not start the camera check. Check your internet connection and try again.");
      }
      return;
    }

    runChallenges(runId);
  }

  function runChallenges(runId: number) {
    const challenges = pickChallenges(2);
    let index = 0;
    let tracker = new ChallengeTracker(challenges[0]!);
    let challengeStartedAt = performance.now();
    let holdFrames = 0;
    let stage: "challenge" | "hold" = "challenge";

    setStep({ index: 0, total: challenges.length });
    setPrompt(CHALLENGE_PROMPTS[challenges[0]!]);
    setPhase("challenge");

    const tick = async () => {
      if (runRef.current !== runId) return;
      const video = videoRef.current;
      const engine = engineRef.current;
      if (!video || !engine || video.readyState < 2) {
        timerRef.current = window.setTimeout(tick, FRAME_INTERVAL_MS);
        return;
      }

      let faces = 0;
      let signals = null as ReturnType<LivenessEngine["detect"]>["signals"];
      try {
        const out = engine.detect(video);
        faces = out.faces;
        signals = out.signals;
      } catch {
        fail("The face check stopped working on this device. Please try again.");
        return;
      }

      if (stage === "challenge") {
        if (performance.now() - challengeStartedAt > CHALLENGE_TIMEOUT_MS) {
          fail(
            "That took too long. Make sure your face is well lit and fully in the frame, then try again.",
          );
          return;
        }
        if (faces > 1) {
          setPrompt("Only one face should be in the frame");
        } else if (!signals) {
          setPrompt("Move your face into the frame");
        } else {
          setPrompt(CHALLENGE_PROMPTS[challenges[index]!]);
          if (tracker.update(signals)) {
            index += 1;
            if (index >= challenges.length) {
              stage = "hold";
              holdFrames = 0;
              setPhase("hold");
              setPrompt("Now look straight at the camera and hold still");
            } else {
              tracker = new ChallengeTracker(challenges[index]!);
              challengeStartedAt = performance.now();
              setStep({ index, total: challenges.length });
              setPrompt(CHALLENGE_PROMPTS[challenges[index]!]);
            }
          }
        }
      } else {
        if (signals && faces === 1 && isFrontFacing(signals)) {
          holdFrames += 1;
        } else {
          holdFrames = 0;
        }
        if (holdFrames >= HOLD_FRAMES_NEEDED) {
          try {
            const selfie = await captureCompressedSelfie(video);
            if (runRef.current !== runId) return;
            const passedAt = new Date().toISOString();
            stopAll();
            const url = URL.createObjectURL(selfie.blob);
            setReviewUrl(url);
            setResult({ selfie, challenges, livenessPassedAt: passedAt });
            setPhase("review");
          } catch (err) {
            fail(
              err instanceof Error ? err.message : "Could not take the photo. Please try again.",
            );
          }
          return;
        }
      }

      timerRef.current = window.setTimeout(tick, FRAME_INTERVAL_MS);
    };

    timerRef.current = window.setTimeout(tick, FRAME_INTERVAL_MS);
  }

  const cameraActive = phase === "loading" || phase === "challenge" || phase === "hold";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full max-w-xs overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "3 / 4" }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="h-full w-full object-cover"
          style={{
            transform: "scaleX(-1)",
            display: cameraActive ? "block" : "none",
          }}
        />
        {phase === "review" && reviewUrl && (
          <img src={reviewUrl} alt="Your selfie preview" className="h-full w-full object-cover" />
        )}
        {phase === "idle" && (
          <div className="flex h-full w-full items-center justify-center text-white/70">
            <Camera size={48} />
          </div>
        )}
        {(phase === "challenge" || phase === "hold") && (
          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 text-center text-sm font-semibold text-white">
            {step.total > 0 && phase === "challenge" && (
              <small className="mb-1 block font-normal opacity-80">
                Step {step.index + 1} of {step.total}
              </small>
            )}
            {prompt}
          </div>
        )}
        {phase === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">
            Starting camera...
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="form-error text-center">
          {error}
        </p>
      )}

      {phase === "idle" && (
        <Button type="button" onClick={() => void start()} disabled={disabled}>
          <Camera size={16} />
          Start live selfie
        </Button>
      )}

      {cameraActive && (
        <Button type="button" variant="ghost" onClick={() => fail("")}>
          Cancel
        </Button>
      )}

      {phase === "review" && result && (
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={() => onConfirm(result)} disabled={disabled}>
            Use this selfie
          </Button>
          <Button type="button" variant="outline" onClick={() => void start()} disabled={disabled}>
            <RefreshCw size={15} />
            Retake
          </Button>
        </div>
      )}

      {phase === "review" && result && (
        <small className="text-xs text-muted-foreground">
          Photo size: about {result.selfie.sizeKb} KB
        </small>
      )}
    </div>
  );
}
