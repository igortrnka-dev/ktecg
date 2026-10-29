import { hasPhoto } from "@/lib/photo";
import Art from "./Art";

/**
 * Image slot: shows public/img/<slug>.jpg when it exists, otherwise the CSS art
 * composition. Drop a photo in and it appears without code changes.
 */
export default function Photo({
  slug,
  variant = 0,
  alt = "",
  fallback,
  eager = false,
}: {
  slug: string;
  variant?: number;
  alt?: string;
  fallback?: React.ReactNode;
  eager?: boolean;
}) {
  if (hasPhoto(slug)) {
    return (
      <div className="photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/${slug}.jpg`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
        <div className="grain" />
      </div>
    );
  }
  return fallback === undefined ? <Art variant={variant} /> : fallback;
}
