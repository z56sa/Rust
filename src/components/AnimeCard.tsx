import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, PlayCircle } from "lucide-react";
import { Anime, Episode } from "@/data/animeData";
import { EpisodeThumbnail } from "@/components/EpisodeThumbnail";

export const AnimeCard = ({ anime }: { anime: Anime }) => {
  return (
    <Link href={`/anime/${anime.slug}`} className="group relative block bg-[#131722] rounded-xl overflow-hidden border border-gray-800/80 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-600/10 transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
        <Image
          src={anime.poster}
          alt={anime.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-transparent opacity-80" />
        
        {/* Rating and Type Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold text-white flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          {anime.rating}
        </div>
        <div className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
          {anime.type}
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white mr-0.5" />
          </div>
        </div>

        {/* Status Tag */}
        <div
          className={`absolute bottom-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded border ${
            anime.status === "مستمر"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-neutral-800/80 text-neutral-300 border-neutral-700/80"
          }`}
        >
          {anime.status === "مستمر" ? "مستمر" : "مكتمل"}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-100 line-clamp-1 group-hover:text-rose-400 transition-colors">
          {anime.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
          <span>{anime.releaseYear}</span>
          <span>{anime.studio}</span>
        </p>
      </div>
    </Link>
  );
};

export const EpisodeCard = ({ anime, episode }: { anime: Anime; episode: Episode }) => {
  const isFiller = (episode as any).isFiller === 1;

  return (
    <Link
      href={`/anime/${anime.slug}/watch/${episode.number}`}
      className="group bg-[#151926] rounded-xl overflow-hidden border border-gray-800/80 hover:border-rose-500/40 hover:shadow-md transition-all flex flex-col"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
        <EpisodeThumbnail
          src={episode.thumbnail || anime.poster}
          fallbackSrc={anime.poster}
          alt={`${anime.title} - الحلقة ${episode.number}`}
        />

        {/* Filler or Canon Badge */}
        {isFiller && (
          <div className="absolute top-2 right-2 bg-white text-black/90 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
            حلقة فلر
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded">
          الحلقة {episode.number}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-gray-300 text-[10px] px-1.5 py-0.5 rounded">
          {episode.duration}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h4 className="font-semibold text-xs text-gray-200 line-clamp-1 group-hover:text-rose-400 transition-colors">
          {anime.title}
        </h4>
        <span className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
          <span className="truncate">{episode.title}</span>
          {isFiller && <span className="text-white text-[10px] font-bold mr-1">فلر</span>}
        </span>
      </div>
    </Link>
  );
};
