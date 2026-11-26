import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, Sparkles } from "lucide-react";

interface SeasonalAnimeItem {
  id: number;
  slug: string;
  title: string;
  poster: string;
  rating?: number | string | null;
  views?: number | null;
}

interface SeasonalSideGridProps {
  topList: SeasonalAnimeItem[];
  gridList: SeasonalAnimeItem[];
}

export function SeasonalSideGrid({ topList, gridList }: SeasonalSideGridProps) {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-white rounded-full" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            أشهر أنميات الموسم
          </h2>
        </div>
        <Link
          href="/seasonal"
          className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
        >
          عرض الموسم بالكامل
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2-Column Layout matching WitAnime Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Left Vertical List: Top 8 List items */}
        <div className="lg:col-span-1 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2">
            <span>الأنمي</span>
            <span>الترتيب</span>
          </div>

          <div className="space-y-1.5">
            {topList.slice(0, 8).map((item, idx) => {
              const rank = idx + 1;
              return (
                <Link
                  key={item.id}
                  href={`/anime/${item.slug}`}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-zinc-800/80 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      <img
                        src={item.poster || "/logo.png"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    </div>
                    <span className="text-xs text-zinc-300 group-hover:text-white font-medium truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 font-bold shrink-0 px-1.5">
                    #{rank}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Cards: Large posters with ranks (3-4 cards) */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {gridList.slice(0, 4).map((item, idx) => {
            const rank = idx + 3; // continues rank
            return (
              <Link
                key={item.id}
                href={`/anime/${item.slug}`}
                className="group flex flex-col bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden transition shadow-lg relative"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.poster || "/logo.png"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white/95 text-black font-black text-sm rounded-lg flex items-center justify-center shadow-lg">
                    {rank}
                  </div>
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                    {item.rating ? Number(item.rating).toFixed(1) : "8.5"}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="p-3 text-right">
                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">موسم مستمر</p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
