import { useState } from "react";
import Lightbox from "./lightbox.tsx";

interface ImageData {
  thumbnailUrl: string;
  fullUrl: string;
  alt: string;
}

interface Props {
  images: ImageData[];
  caption?: string;
}

export default function LightboxGallery({ images, caption }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const columns = images.length === 1 ? 1 : images.length === 2 ? 2 : 3;

  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <>
      <div className={`grid gap-2 ${gridClass}`}>
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="cursor-zoom-in"
          >
            <img
              src={image.thumbnailUrl}
              alt={image.alt}
              className="rounded-lg w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {caption && (
        <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {caption}
        </figcaption>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images.map((img) => ({ src: img.fullUrl, alt: img.alt }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
