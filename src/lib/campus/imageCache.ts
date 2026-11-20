/**
 * Tiny in-memory helpers so listing photos do not "reload" when people switch tabs.
 * - seenImages: photos that already loaded once in this session (cards skip their fade-in)
 * - warmImages: quietly pre-load the first photos so they are ready before the card shows
 */
const seenImages = new Set<string>();
const warming = new Set<string>();

export function hasSeenImage(url: string): boolean {
  return Boolean(url) && seenImages.has(url);
}

export function markImageSeen(url: string): void {
  if (url) seenImages.add(url);
}

export function warmImages(urls: Array<string | undefined | null>, max = 16): void {
  if (typeof window === "undefined") return;
  let count = 0;
  for (const url of urls) {
    if (!url || seenImages.has(url) || warming.has(url)) continue;
    if (count >= max) break;
    count += 1;
    warming.add(url);
    const img = new Image();
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      seenImages.add(url);
      warming.delete(url);
    };
    img.onerror = () => warming.delete(url);
    img.src = url;
  }
}
