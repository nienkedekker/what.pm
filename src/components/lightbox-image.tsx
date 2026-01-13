import { useState } from "react";
import Lightbox from "./lightbox.tsx";

interface Props {
  thumbnailUrl: string;
  fullUrl: string;
  alt: string;
}

export default function LightboxImage({ thumbnailUrl, fullUrl, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="block w-full cursor-zoom-in">
        <img src={thumbnailUrl} alt={alt} className="rounded-lg w-full" loading="lazy" />
      </button>

      {isOpen && <Lightbox images={[{ src: fullUrl, alt }]} onClose={() => setIsOpen(false)} />}
    </>
  );
}
