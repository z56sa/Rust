'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Check, Server, Eye, Calendar, Film, Bookmark, Heart, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeActionButtons } from '@/components/AnimeActionButtons';

interface ServerOption {
  name: string;
  url: string;
  quality: string;
}

interface EpisodeInfo {
  number: number;
  title: string;
  thumbnail?: string;
  duration?: string;
}

interface RecommendedAnime {
  id: string | number;
  slug: string;
  title: string;
  poster: string;
  rating?: string;
  type?: string;
}

interface WatchPlayerProps {
  animeSlug: string;
  animeTitle: string;
  animeTitleJapanese?: string;
  animePoster?: string;
  animeSynopsis?: string;
  animeType?: string;
  animeStatus?: string;
  animeYear?: number;
  animeRating?: string;
  animeGenres?: string[];
  currentEpisode: number;
  totalEpisodes: number;
  servers: ServerOption[];
  episodesList: EpisodeInfo[];
  recommendedAnimes?: RecommendedAnime[];
  animeId?: string | number;
}

export default function WatchPlayer({
  animeSlug,
  animeTitle,
  animeTitleJapanese,
  animePoster,
  animeSynopsis,
  animeType = 'TV',
  animeStatus = 'مستمر',
  animeYear = 2024,
  animeRating = '8.5',
  animeGenres = [],
  currentEpisode,
  totalEpisodes,
  servers,
  episodesList = [],
  recommendedAnimes = [],
  animeId = 1,
}: WatchPlayerProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const activeServer = servers[selectedServerIndex] || servers[0];

  const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
  const nextEpisode = currentEpisode < totalEpisodes ? currentEpisode + 1 : null;

  return (
    <div className="space-y-10">
      {/* Upper Section: Video Player + Episode Sidebar (WitAnime Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Player & Controls (Takes 3 columns on desktop) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Episode Top Navigation Bar */}
          <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 px-4 py-2.5 rounded-xl text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-xs">تشاهد الآن:</span>
              <span className="font-bold text-white text-xs sm:text-sm">{animeTitle} - الحلقة {currentEpisode}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {prevEpisode && (
                <Link
                  href={`/anime/${animeSlug}/watch/${prevEpisode}`}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  السابقة
                </Link>
              )}
              {nextEpisode && (
                <Link
                  href={`/anime/${animeSlug}/watch/${nextEpisode}`}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                >
                  التالية
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Video Iframe Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800/80 shadow-2xl">
            {activeServer ? (
              <iframe
                src={activeServer.url}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
                title={`الحلقة ${currentEpisode}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
                <Film className="w-12 h-12 text-zinc-700" />
                <p>لا يتوفر سيرفر تشغيل لهذه الحلقة حالياً</p>
              </div>
            )}
          </div>

          {/* Servers Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                <Server className="w-4 h-4 text-white" />
                <span>سيرفرات المشاهدة المتوفرة:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {servers.map((srv, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedServerIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedServerIndex === idx
                        ? 'bg-white text-black shadow-md'
                        : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {srv.name}
                    {selectedServerIndex === idx && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {activeServer && (
              <a
                href={activeServer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs transition self-start sm:self-auto shrink-0"
              >
                <span>فتح السيرفر في نافذة خارجية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right Sidebar: Episodes List with thumbnails */}
        <div className="lg:col-span-1 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col h-[560px]">
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-white" />
              <span className="font-bold text-white text-sm">قائمة الحلقات</span>
            </div>
            <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md font-mono">
              {episodesList.length || totalEpisodes} حلقة
            </span>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1.5 custom-scrollbar">
            {(episodesList.length > 0 ? episodesList : Array.from({ length: totalEpisodes }, (_, i) => ({
              number: i + 1,
              title: `الحلقة ${i + 1}`,
              thumbnail: animePoster
            }))).map((ep) => {
              const isActive = ep.number === currentEpisode;
              const epThumb = ep.thumbnail || animePoster || '/logo.svg';

              return (
                <Link
                  key={ep.number}
                  href={`/anime/${animeSlug}/watch/${ep.number}`}
                  className={`flex items-center gap-3 p-2 rounded-xl transition group relative overflow-hidden ${
                    isActive
                      ? 'bg-zinc-800 border border-white/20 shadow-md'
                      : 'hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800">
                    <img
                      src={epThumb}
                      alt={`الحلقة ${ep.number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0 text-right">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                      الحلقة {ep.number}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {ep.title && ep.title !== `الحلقة ${ep.number}` ? ep.title : animeTitle}
                    </p>
                  </div>

                  {isActive && (
                    <span className="text-[10px] bg-white text-black font-bold px-1.5 py-0.5 rounded shrink-0">
                      الآن
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Middle Section: Anime Details (تفاصيل الأنمي) */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Poster */}
          {animePoster && (
            <div className="w-36 sm:w-44 shrink-0 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 relative aspect-[2/3] mx-auto md:mx-0">
              <img
                src={animePoster}
                alt={animeTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content & Metadata */}
          <div className="flex-1 space-y-4 text-right w-full">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{animeTitle}</h2>
              {animeTitleJapanese && (
                <p className="text-sm text-zinc-400 mt-1 font-sans">{animeTitleJapanese}</p>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/60 border border-zinc-800/60 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-zinc-500 block">النوع</span>
                <span className="font-bold text-zinc-200">{animeType}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">الحالة</span>
                <span className="font-bold text-zinc-200">{animeStatus}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">سنة الإنتاج</span>
                <span className="font-bold text-zinc-200">{animeYear}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">التقييم</span>
                <span className="font-bold text-white flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  {animeRating}
                </span>
              </div>
            </div>

            {/* Genres */}
            {animeGenres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {animeGenres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 rounded-lg text-xs transition border border-zinc-700/50"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {animeSynopsis && (
              <div>
                <h3 className="text-xs font-bold text-zinc-400 mb-1.5">قصة الأنمي:</h3>
                <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
                  {animeSynopsis}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 items-center justify-end">
              <AnimeActionButtons animeId={String(animeId)} slug={animeSlug} title={animeTitle} />
              <Link
                href={`/anime/${animeSlug}`}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition"
              >
                صفحة الأنمي الكاملة
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: You May Also Like (قد يعجبك أيضًا) */}
      {recommendedAnimes && recommendedAnimes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-white rounded-full" />
              <h3 className="text-lg sm:text-xl font-bold text-white">قد يعجبك أيضًا</h3>
            </div>
            <Link
              href="/anime"
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1"
            >
              عرض المزيد
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {recommendedAnimes.slice(0, 6).map((rec) => (
              <Link
                key={rec.id}
                href={`/anime/${rec.slug}`}
                className="group flex flex-col bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 rounded-xl overflow-hidden transition"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={rec.poster || '/logo.svg'}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {rec.rating && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      {rec.rating}
                    </div>
                  )}
                  {rec.type && (
                    <div className="absolute top-2 left-2 bg-zinc-900/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                      {rec.type}
                    </div>
                  )}
                </div>
                <div className="p-2.5 text-right">
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                    {rec.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
