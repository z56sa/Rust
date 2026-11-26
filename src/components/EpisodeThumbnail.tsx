"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface EpisodeThumbnailProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

export function EpisodeThumbnail({
  src,
  fallbackSrc,
  alt,
  className = "object-cover group-hover:scale-105 transition-transform duration-300",
}: EpisodeThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#121522]">
      <Image
        src={imgSrc || fallbackSrc}
        alt={alt}
        fill
        unoptimized
        className={className}
        onError={() => {
          if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
            setHasError(true);
            setImgSrc(fallbackSrc);
          }
        }}
      />
      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
        <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white/90 group-hover:text-rose-500 group-hover:scale-110 transition-all drop-shadow-lg" />
      </div>
    </div>
  );
}
