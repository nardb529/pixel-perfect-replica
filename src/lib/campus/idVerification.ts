import type { IdDocumentType } from "@/lib/supabase/database.types";

export interface ImageValidityResult {
  valid: boolean;
  reason?: string | undefined;
  format: "JPEG" | "PNG" | "WebP" | "AVIF" | "Unknown";
  width: number;
  height: number;
  aspectRatio: number;
  meanLuma: number;
  contrastStdDev: number;
  edgeDensity: number;
  dHash: string;
  fileSizeBytes: number;
  summary: string;
}

export interface VerificationChecksPayload {
  documentType: IdDocumentType;
  isStudent: boolean;
  format: string;
  resolution: string;
  aspectRatio: number;
  cardFramingPassed: boolean;
  clarityPassed: boolean;
  distinctFromProfilePhoto: boolean;
  checkedAt: string;
}

async function readHeaderBytes(file: File, maxBytes = 16): Promise<Uint8Array | null> {
  const slice = file.slice(0, maxBytes);
  if (typeof slice.arrayBuffer === "function") {
    try {
      return new Uint8Array(await slice.arrayBuffer());
    } catch {
      // Fallback below
    }
  }
  if (typeof file.arrayBuffer === "function") {
    try {
      return new Uint8Array(await file.arrayBuffer()).slice(0, maxBytes);
    } catch {
      // Fallback below
    }
  }
  if (typeof FileReader !== "undefined") {
    try {
      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error || new Error("FileReader failed"));
        reader.readAsArrayBuffer(slice);
      });
      return new Uint8Array(buffer);
    } catch {
      return null;
    }
  }
  return null;
}

export async function verifyImageBinarySignature(
  file: File,
): Promise<{ valid: boolean; format: ImageValidityResult["format"]; reason?: string }> {
  if (!file || typeof file.slice !== "function") {
    return { valid: false, format: "Unknown", reason: "No readable image file was selected." };
  }
  if (file.size < 4096) {
    return {
      valid: false,
      format: "Unknown",
      reason: "Image file is too small or corrupted. Upload a full-quality photo.",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      valid: false,
      format: "Unknown",
      reason: "Image must be 5 MB or smaller.",
    };
  }

  const bytes = await readHeaderBytes(file, 16);
  if (!bytes) {
    return { valid: false, format: "Unknown", reason: "Could not read image file bytes." };
  }

  if (bytes.length < 12) {
    return { valid: false, format: "Unknown", reason: "Image header is truncated or invalid." };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, format: "JPEG" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, format: "PNG" };
  }

  // WebP: RIFF....WEBP
  const riff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const webp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (riff && webp) {
    return { valid: true, format: "WebP" };
  }

  // AVIF: ....ftypavif | avis | mif1
  const ftyp = bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
  if (ftyp) {
    const brand = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0);
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return { valid: true, format: "AVIF" };
    }
  }

  return {
    valid: false,
    format: "Unknown",
    reason: "Unsupported or spoofed image file. Upload a genuine JPG, PNG, WebP, or AVIF photo.",
  };
}

export function hammingDistanceHex(a?: string | null, b?: string | null): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return Number.POSITIVE_INFINITY;
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    const xor = Number.parseInt(a[i]!, 16) ^ Number.parseInt(b[i]!, 16);
    if (Number.isNaN(xor)) return Number.POSITIVE_INFINITY;
    let v = xor;
    while (v > 0) {
      dist += v & 1;
      v >>= 1;
    }
  }
  return dist;
}

export function checkIdAndProfilePair(idHash?: string | null, profileHash?: string | null): string {
  if (!idHash || !profileHash) return "";
  const distance = hammingDistanceHex(idHash, profileHash);
  if (distance <= 6) {
    return "Your ID image and real profile photo appear to be the same photo. Upload your ID card separately from your real profile photo.";
  }
  return "";
}

function docDisplayLabel(docType?: IdDocumentType): string {
  if (docType === "Voters ID") return "Voter's ID";
  return docType || "ID card";
}

function computeImagePixelMetrics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): { meanLuma: number; contrastStdDev: number; edgeDensity: number; dHash: string } {
  const { data } = ctx.getImageData(0, 0, width, height);
  const totalPixels = width * height;
  const luma = new Float32Array(totalPixels);
  let sum = 0;

  for (let i = 0; i < totalPixels; i++) {
    const offset = i * 4;
    const y = 0.299 * data[offset]! + 0.587 * data[offset + 1]! + 0.114 * data[offset + 2]!;
    luma[i] = y;
    sum += y;
  }

  const meanLuma = sum / Math.max(1, totalPixels);
  let varianceSum = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = luma[i]! - meanLuma;
    varianceSum += diff * diff;
  }
  const contrastStdDev = Math.sqrt(varianceSum / Math.max(1, totalPixels));

  // Gradient edge density on interior pixels to reject blank/solid/washed images
  let edgeCount = 0;
  let sampleCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx = Math.abs(luma[idx + 1]! - luma[idx - 1]!);
      const gy = Math.abs(luma[idx + width]! - luma[idx - width]!);
      if (gx + gy > 24) {
        edgeCount++;
      }
      sampleCount++;
    }
  }
  const edgeDensity = sampleCount > 0 ? edgeCount / sampleCount : 0;

  // 9x8 difference hash (64-bit)
  const hashCanvas = document.createElement("canvas");
  hashCanvas.width = 9;
  hashCanvas.height = 8;
  const hctx = hashCanvas.getContext("2d");
  let dHash = "";
  if (hctx) {
    hctx.drawImage(ctx.canvas, 0, 0, 9, 8);
    const hData = hctx.getImageData(0, 0, 9, 8).data;
    let nibble = 0;
    let bitPos = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const leftIdx = (row * 9 + col) * 4;
        const rightIdx = (row * 9 + col + 1) * 4;
        const leftL =
          0.299 * hData[leftIdx]! + 0.587 * hData[leftIdx + 1]! + 0.114 * hData[leftIdx + 2]!;
        const rightL =
          0.299 * hData[rightIdx]! + 0.587 * hData[rightIdx + 1]! + 0.114 * hData[rightIdx + 2]!;
        if (leftL > rightL) {
          nibble |= 1 << (3 - bitPos);
        }
        bitPos++;
        if (bitPos === 4) {
          dHash += nibble.toString(16);
          nibble = 0;
          bitPos = 0;
        }
      }
    }
  }

  return { meanLuma, contrastStdDev, edgeDensity, dHash };
}

export async function inspectVerificationImage(
  file: File,
  kind: "id" | "profile",
  expectedDocType?: IdDocumentType,
): Promise<ImageValidityResult> {
  const sig = await verifyImageBinarySignature(file);
  if (!sig.valid) {
    return {
      valid: false,
      reason: sig.reason,
      format: sig.format,
      width: 0,
      height: 0,
      aspectRatio: 0,
      meanLuma: 0,
      contrastStdDev: 0,
      edgeDensity: 0,
      dHash: "",
      fileSizeBytes: file?.size ?? 0,
      summary: sig.reason || "Invalid image file.",
    };
  }

  if (typeof document === "undefined" || typeof createImageBitmap === "undefined") {
    return {
      valid: true,
      format: sig.format,
      width: 0,
      height: 0,
      aspectRatio: 0,
      meanLuma: 128,
      contrastStdDev: 32,
      edgeDensity: 0.1,
      dHash: "",
      fileSizeBytes: file.size,
      summary: `${sig.format} signature verified (${Math.round(file.size / 1024)} KB).`,
    };
  }

  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const width = bitmap.width;
    const height = bitmap.height;
    const aspectRatio = height > 0 ? Number((width / height).toFixed(2)) : 0;

    if (kind === "id") {
      if (Math.max(width, height) < 420 || Math.min(width, height) < 240) {
        return {
          valid: false,
          reason: `ID image resolution (${width}×${height}) is too low to verify card text. Upload a sharp photo of your ${docDisplayLabel(expectedDocType)}.`,
          format: sig.format,
          width,
          height,
          aspectRatio,
          meanLuma: 0,
          contrastStdDev: 0,
          edgeDensity: 0,
          dHash: "",
          fileSizeBytes: file.size,
          summary: `Resolution ${width}×${height} too low.`,
        };
      }

      if (aspectRatio < 0.45 || aspectRatio > 2.7) {
        return {
          valid: false,
          reason: `This image framing does not match a physical ${docDisplayLabel(expectedDocType)}. Capture the full rectangular card clearly without tall chat screenshots.`,
          format: sig.format,
          width,
          height,
          aspectRatio,
          meanLuma: 0,
          contrastStdDev: 0,
          edgeDensity: 0,
          dHash: "",
          fileSizeBytes: file.size,
          summary: `Unexpected card aspect ratio (${aspectRatio}).`,
        };
      }

      if (aspectRatio >= 0.9 && aspectRatio <= 1.12) {
        return {
          valid: false,
          reason: `Square 1:1 images are usually avatars rather than an ID card. Frame the full rectangular ${docDisplayLabel(expectedDocType)} so all edges and details are visible.`,
          format: sig.format,
          width,
          height,
          aspectRatio,
          meanLuma: 0,
          contrastStdDev: 0,
          edgeDensity: 0,
          dHash: "",
          fileSizeBytes: file.size,
          summary: `Square crop (${width}×${height}) rejected for ID card.`,
        };
      }
    } else if (width < 200 || height < 200) {
      return {
        valid: false,
        reason: `Profile photo (${width}×${height}) is too small. Upload a clear real photo of your face (at least 200×200 px).`,
        format: sig.format,
        width,
        height,
        aspectRatio,
        meanLuma: 0,
        contrastStdDev: 0,
        edgeDensity: 0,
        dHash: "",
        fileSizeBytes: file.size,
        summary: `Profile photo resolution ${width}×${height} too low.`,
      };
    }

    const scale = Math.min(1, 240 / Math.max(width, height));
    const sw = Math.max(24, Math.round(width * scale));
    const sh = Math.max(24, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return {
        valid: true,
        format: sig.format,
        width,
        height,
        aspectRatio,
        meanLuma: 128,
        contrastStdDev: 32,
        edgeDensity: 0.1,
        dHash: "",
        fileSizeBytes: file.size,
        summary: `${sig.format} · ${width}×${height} px verified.`,
      };
    }

    ctx.drawImage(bitmap, 0, 0, sw, sh);
    const metrics = computeImagePixelMetrics(ctx, sw, sh);

    if (metrics.meanLuma < 22 || metrics.meanLuma > 246) {
      return {
        valid: false,
        reason:
          metrics.meanLuma < 22
            ? "Photo is too dark to inspect. Retake it in bright, even lighting."
            : "Photo is overexposed or blank white. Retake it with clear lighting.",
        format: sig.format,
        width,
        height,
        aspectRatio,
        ...metrics,
        fileSizeBytes: file.size,
        summary: "Exposure out of readable range.",
      };
    }

    const minStdDev = kind === "id" ? 12 : 10;
    if (metrics.contrastStdDev < minStdDev || (kind === "id" && metrics.edgeDensity < 0.025)) {
      return {
        valid: false,
        reason:
          kind === "id"
            ? `This image lacks readable card edges or text for a ${docDisplayLabel(expectedDocType)}. Place the card on a flat surface and capture a sharp photo.`
            : "This image appears blank or uniformly flat. Upload a clear real photo of yourself.",
        format: sig.format,
        width,
        height,
        aspectRatio,
        ...metrics,
        fileSizeBytes: file.size,
        summary: "Insufficient image detail/contrast.",
      };
    }

    return {
      valid: true,
      format: sig.format,
      width,
      height,
      aspectRatio,
      ...metrics,
      fileSizeBytes: file.size,
      summary: `${sig.format} · ${width}×${height} px · Clear detail`,
    };
  } catch {
    return {
      valid: false,
      reason: "Unable to decode this image file. Choose a standard JPG or PNG photo.",
      format: sig.format,
      width: 0,
      height: 0,
      aspectRatio: 0,
      meanLuma: 0,
      contrastStdDev: 0,
      edgeDensity: 0,
      dHash: "",
      fileSizeBytes: file.size,
      summary: "Image decode failed.",
    };
  } finally {
    bitmap?.close();
  }
}
