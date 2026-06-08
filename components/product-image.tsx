"use client";

import { useState } from "react";

const placeholder = "/product-placeholder.svg";

type ProductImageProps = {
  alt: string;
  src: string | null;
};

export function ProductImage({ alt, src }: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src || placeholder);

  return (
    <img
      alt={src ? alt : ""}
      className="h-full w-full object-contain"
      onError={() => setImageSrc(placeholder)}
      src={imageSrc}
    />
  );
}
