/**
 * Free, in-browser liveness checks for seller verification.
 *
 * - Uses Google's open-source MediaPipe Face Landmarker, loaded from a public CDN
 *   at the moment the seller taps "Start camera" (nothing is added to the app bundle).
 * - Every camera frame is analysed locally in the browser and then discarded.
 *   Frames and video are never uploaded or saved. Only the single final selfie is.
 * - No face-recognition template is created or stored.
 * - These checks are basic. They do not prove legal identity and cannot guarantee
 *   fraud prevention. An administrator still approves every seller by hand.
 */

const MEDIAPIPE_VERSION = "0.10.14";
const MEDIAPIPE_MODULE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/vision_bundle.mjs`;
const MEDIAPIPE_WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type LivenessChallenge = "blink" | "smile" | "turn";

export const CHALLENGE_PROMPTS: Record<LivenessChallenge, string> = {
  blink: "Blink both eyes",
  smile: "Give a big smile",
  turn: "Slowly turn your head to one side",
};

export interface FaceSignals {
  /** 0..1, higher means eyes more closed (average of both eyes) */
  blink: number;
  /** 0..1, higher means a wider smile */
  smile: number;
  /** nose position between the two cheeks: ~0.5 when facing the camera */
  yaw: number;
  /** face width as a fraction of the frame width */
  faceWidth: number;
  /** horizontal face centre as a fraction of the frame width */
  centerX: number;
}

export interface LivenessEngine {
  detect(video: HTMLVideoElement): { faces: number; signals: FaceSignals | null };
  close(): void;
}

interface Category {
  categoryName: string;
  score: number;
}

interface Landmark {
  x: number;
  y: number;
}

interface FaceLandmarkerResult {
  faceLandmarks?: Landmark[][];
  faceBlendshapes?: Array<{ categories: Category[] }>;
}

interface FaceLandmarkerLike {
  detectForVideo(video: HTMLVideoElement, timestampMs: number): FaceLandmarkerResult;
  close(): void;
}

function score(categories: Category[], name: string): number {
  return categories.find((c) => c.categoryName === name)?.score ?? 0;
}

export async function loadLivenessEngine(): Promise<LivenessEngine> {
  // The URL is only fetched in the browser, at runtime.
  const vision = await import(/* @vite-ignore */ MEDIAPIPE_MODULE_URL);
  const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);

  async function create(delegate: "GPU" | "CPU"): Promise<FaceLandmarkerLike> {
    return vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate },
      runningMode: "VIDEO",
      numFaces: 2,
      outputFaceBlendshapes: true,
    });
  }

  let landmarker: FaceLandmarkerLike;
  try {
    landmarker = await create("GPU");
  } catch {
    landmarker = await create("CPU");
  }

  let lastTimestamp = 0;

  return {
    detect(video) {
      // MediaPipe needs strictly increasing timestamps.
      const now = Math.max(performance.now(), lastTimestamp + 1);
      lastTimestamp = now;
      const result = landmarker.detectForVideo(video, now);
      const faces = result.faceLandmarks?.length ?? 0;
      if (faces !== 1) return { faces, signals: null };

      const marks = result.faceLandmarks![0]!;
      const categories = result.faceBlendshapes?.[0]?.categories ?? [];
      const nose = marks[1];
      const leftEdge = marks[234];
      const rightEdge = marks[454];
      if (!nose || !leftEdge || !rightEdge) return { faces, signals: null };

      const width = Math.abs(rightEdge.x - leftEdge.x) || 1;
      const minX = Math.min(leftEdge.x, rightEdge.x);
      return {
        faces,
        signals: {
          blink: (score(categories, "eyeBlinkLeft") + score(categories, "eyeBlinkRight")) / 2,
          smile: (score(categories, "mouthSmileLeft") + score(categories, "mouthSmileRight")) / 2,
          yaw: (nose.x - minX) / width,
          faceWidth: width,
          centerX: minX + width / 2,
        },
      };
    },
    close() {
      try {
        landmarker.close();
      } catch {
        /* ignore */
      }
    },
  };
}

/** Two different random challenges, in random order. */
export function pickChallenges(count = 2): LivenessChallenge[] {
  const pool: LivenessChallenge[] = ["blink", "smile", "turn"];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0]! % (i + 1);
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, count);
}

/**
 * Tracks one challenge at a time. Each challenge needs a clear "neutral" state first
 * and then the action, so a still photo held up to the camera does not pass.
 */
export class ChallengeTracker {
  private sawNeutral = false;
  private neutralFrames = 0;

  constructor(readonly challenge: LivenessChallenge) {}

  update(s: FaceSignals): boolean {
    switch (this.challenge) {
      case "blink": {
        if (s.blink < 0.25) this.sawNeutral = true;
        return this.sawNeutral && s.blink > 0.55;
      }
      case "smile": {
        if (s.smile < 0.25) this.sawNeutral = true;
        return this.sawNeutral && s.smile > 0.55;
      }
      case "turn": {
        if (Math.abs(s.yaw - 0.5) < 0.08) this.neutralFrames += 1;
        if (this.neutralFrames >= 3) this.sawNeutral = true;
        return this.sawNeutral && Math.abs(s.yaw - 0.5) > 0.17;
      }
      default:
        return false;
    }
  }
}

/** Looking straight at the camera, centred, close enough. */
export function isFrontFacing(s: FaceSignals): boolean {
  return (
    Math.abs(s.yaw - 0.5) < 0.07 &&
    Math.abs(s.centerX - 0.5) < 0.18 &&
    s.faceWidth > 0.28 &&
    s.blink < 0.35
  );
}

export interface CompressedSelfie {
  blob: Blob;
  width: number;
  height: number;
  sizeKb: number;
}

const TARGET_MAX_BYTES = 250 * 1024;

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", quality));
}

/**
 * Captures the current video frame and shrinks it on the device to roughly
 * 150-250 KB (JPEG), keeping enough detail for an administrator to see the face.
 */
export async function captureCompressedSelfie(video: HTMLVideoElement): Promise<CompressedSelfie> {
  const srcW = video.videoWidth;
  const srcH = video.videoHeight;
  if (!srcW || !srcH) throw new Error("Camera is not ready yet.");

  let maxSide = 800;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const scale = Math.min(1, maxSide / Math.max(srcW, srcH));
    const w = Math.round(srcW * scale);
    const h = Math.round(srcH * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare the photo.");
    ctx.drawImage(video, 0, 0, w, h);

    for (const quality of [0.88, 0.8, 0.72, 0.64, 0.56]) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob && blob.size <= TARGET_MAX_BYTES) {
        return { blob, width: w, height: h, sizeKb: Math.round(blob.size / 1024) };
      }
    }
    maxSide = Math.round(maxSide * 0.8);
  }
  throw new Error("Could not shrink the photo enough. Please try again in better light.");
}
