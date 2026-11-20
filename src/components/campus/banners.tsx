import { useState, type ReactNode } from "react";

export type BannerKey = "discover" | "products" | "services" | "shop";

export const DEFAULT_BANNERS: Record<BannerKey, string> = {
  discover: "/banners/discover.jpg",
  products: "/banners/products.jpg",
  services: "/banners/services.jpg",
  shop: "/banners/shop-default.jpg",
};

/**
 * Banner image with a readable text area on top.
 * `image` can be a custom banner (for example a seller's own shop banner).
 * If it fails to load, the default banner for that page is used.
 */
export function PageBanner({
  banner,
  image,
  children,
  className = "",
}: {
  banner: BannerKey;
  image?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const fallback = DEFAULT_BANNERS[banner];
  const [failed, setFailed] = useState(false);
  const src = image && !failed ? image : fallback;

  return (
    <section className={`page-banner page-banner-${banner} ${className}`.trim()}>
      <img
        className="page-banner-media"
        src={src}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
        onError={() => {
          if (src !== fallback) setFailed(true);
        }}
      />
      <div className="page-banner-shade" aria-hidden="true" />
      <div className="page-banner-inner">{children}</div>
    </section>
  );
}
