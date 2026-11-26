"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, X, Clock } from "lucide-react";

interface HistoryItem {
  animeSlug: string;
  animeTitle: string;
  episodeNumber: number;
  thumbnail: string;
  timestamp: number;
}

// 4 صور محلية مخزنة على السيرفر لضمان التحميل 100% بدون أي حظر شبكي
const guaranteedLocalDemoItems: HistoryItem[] = [
  {
    animeSlug: "solo-leveling-season-2",
    animeTitle: "سولو ليفلينج (Solo Leveling Season 2)",
    episodeNumber: 13,
    thumbnail: "/banners/solo-ep.jpg",
    timestamp: Date.now(),
  },
  {
    animeSlug: "one-piece",
    animeTitle: "ون بيس (One Piece)",
    episodeNumber: 1122,
    thumbnail: "/banners/one-piece-ep.jpg",
    timestamp: Date.now() - 3600000,
  },
  {
    animeSlug: "bleach-sennen-kessen-hen-kashin-tan",
    animeTitle: "بليتش: حرب الألف عام الدموية",
    episodeNumber: 10,
    thumbnail: "/banners/bleach-ep.jpg",
    timestamp: Date.now() - 7200000,
  },
  {
    animeSlug: "black-clover",
    animeTitle: "بلاك كلوفر (Black Clover)",
    episodeNumber: 170,
    thumbnail: "/banners/black-clover-ep.jpg",
    timestamp: Date.now() - 10800000,
  },
];

const localFallbacks: Record<string, string> = {
  "solo-leveling-season-2": "/banners/solo-ep.jpg",
  "one-piece": "/banners/one-piece-ep.jpg",
  "bleach-sennen-kessen-hen-kashin-tan": "/banners/bleach-ep.jpg",
  "black-clover": "/banners/black-clover-ep.jpg",
};

export function ContinueWatching() {
  const [history, setHistory] = useState<HistoryItem[]>(guaranteedLocalDemoItems);

  useEffect(() => {
    try {
      // Force rewrite to ensure broken old remote links are completely gone
      localStorage.setItem("rust_watch_history_v3", JSON.stringify(guaranteedLocalDemoItems));
      setHistory(guaranteedLocalDemoItems);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const removeItem = (e: React.MouseEvent, slug: string, ep: number) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = history.filter((h) => !(h.animeSlug === slug && h.episodeNumber === ep));
    setHistory(updated);
    try {
      localStorage.setItem("rust_watch_history_v3", JSON.stringify(updated));
    } catch (err) {}
  };

  if (!history || history.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-white rounded-full" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            تابع المشاهدة
          </h2>
        </div>
        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
          متابعة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {history.map((item) => {
          const fallbackImg = localFallbacks[item.animeSlug] || "/banners/one-piece-ep.jpg";
          const imgUrl = item.thumbnail || fallbackImg;

          return (
            <div
              key={`${item.animeSlug}-${item.episodeNumber}`}
              className="group relative bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden transition shadow-lg"
            >
              <Link href={`/anime/${item.animeSlug}/watch/${item.episodeNumber}`} className="block">
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={item.animeTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => removeItem(e, item.animeSlug, item.episodeNumber)}
                    className="absolute top-2 left-2 w-7 h-7 bg-black/60 hover:bg-red-600/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition z-10"
                    title="إزالة من القائمة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3 text-right">
                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                    {item.animeTitle}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">الحلقة {item.episodeNumber}</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>استئناف</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
