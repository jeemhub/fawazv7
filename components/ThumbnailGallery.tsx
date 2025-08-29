"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThumbnailGalleryProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  className?: string;
}

export default function ThumbnailGallery({
  images,
  currentIndex,
  onThumbnailClick,
  className = ""
}: ThumbnailGalleryProps) {
  if (!images || images.length <= 1) return null;

  return (
    <div className={cn("flex gap-2 mt-4 overflow-x-auto pb-2", className)}>
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onThumbnailClick(index)}
          className={cn(
            "relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 flex-shrink-0",
            index === currentIndex
              ? "border-fawaz-green-500 ring-2 ring-fawaz-green-200"
              : "border-gray-200 hover:border-gray-300"
          )}
          aria-label={`View image ${index + 1}`}
        >
          <Image
            src={image}
            alt={`Thumbnail ${index + 1}`}
            fill
            className="object-cover"
          />
          {index === currentIndex && (
            <div className="absolute inset-0 bg-fawaz-green-500/20" />
          )}
        </button>
      ))}
    </div>
  );
}
