import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft } from "lucide-react";

interface TopRankItem {
  id: number;
  slug: string;
  title: string;
  poster: string;
  rating?: number | string | null;
  releaseYear?: number | null;
  type?: string | null;
  views?: number | null;
}

interface RankedSliderSectionProps {
  title: string;
  badge?: string;
  viewAllLink?: string;
  items: TopRankItem[];
}

export function RankedSliderSection({
  title,
  badge = "كل الأوقات",
  viewAllLink = "/anime",
  items,
}: RankedSliderSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-white rounded-full" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md font-medium">
            {badge}
          </span>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              عرض الكل
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Grid with Rank Numbers (1, 2, 3...) matching WitAnime Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {items.slice(0, 6).map((item, idx) => {
          const rank = idx + 1;
          const ratingVal = item.rating ? Number(item.rating).toFixed(1) : "8.5";

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
                  loading="lazy" referrerPolicy="no-referrer"
                />

                {/* Rank Badge at Top-Right */}
                <div className="absolute top-2 right-2 w-7 h-7 bg-white/95 text-black font-black text-sm rounded-lg flex items-center justify-center shadow-lg">
                  {rank}
                </div>

                {/* Type Badge at Top-Left if available */}
                {item.type && (
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                    {item.type}
                  </div>
                )}

                {/* Gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Title & Rating */}
              <div className="p-3 text-right">
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 font-bold text-zinc-300">
                    <Star className="w-3 h-3 fill-white text-white" />
                    {ratingVal}
                  </span>
                  {item.releaseYear && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {item.releaseYear}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
