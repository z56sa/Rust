import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft } from "lucide-react";

interface MovieItem {
  id: number;
  slug: string;
  title: string;
  poster: string;
  rating?: number | string | null;
  releaseYear?: number | null;
  type?: string | null;
}

interface LatestMoviesSectionProps {
  movies: MovieItem[];
}

export function LatestMoviesSection({ movies }: LatestMoviesSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-white rounded-full" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            أحدث الأفلام
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md font-medium">
            جديد
          </span>
          <Link
            href="/movies"
            className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
          >
            عرض الكل
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid of Movie Cards (12 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {movies.slice(0, 12).map((item) => {
          const ratingVal = item.rating ? Number(item.rating).toFixed(1) : "8.0";

          return (
            <Link
              key={item.id}
              href={`/anime/${item.slug}`}
              className="group flex flex-col bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden transition shadow-lg relative"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                <img
                  src={item.poster || "/logo.png"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy" referrerPolicy="no-referrer" onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "/brand-logo.jpg"; }}
                />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  {ratingVal}
                </div>

                {/* Film Badge */}
                <div className="absolute top-2 left-2 bg-zinc-900/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                  فيلم
                </div>

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Title & Info */}
              <div className="p-3 text-right">
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.releaseYear || 2024}
                  </span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                    FHD
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
