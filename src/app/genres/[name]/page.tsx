import React from "react";
import Link from "next/link";
import { getAnimesByGenre } from "@/lib/animeService";
import { AnimeCard } from "@/components/AnimeCard";
import { Layers, ChevronRight, Film } from "lucide-react";
import { Anime } from "@/data/animeData";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return {
    title: `أنميات تصنيف ${decoded} | راست أنمي`,
    description: `مشاهدة وتحميل أفضل مسلسلات وأفلام أنمي من تصنيف ${decoded} مترجمة بجودة عالية.`,
  };
}

export default async function GenreDetailsPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedGenre = decodeURIComponent(name);
  const animesFromDb = await getAnimesByGenre(decodedGenre);

  const formattedAnimes: Anime[] = animesFromDb.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    japaneseTitle: a.japaneseTitle || "",
    synopsis: a.synopsis || "",
    poster: a.poster,
    banner: a.banner,
    rating: a.rating || 0,
    genres: a.genres,
    status: (a.status as "مستمر" | "مكتمل") || "مستمر",
    type: (a.type as "TV" | "Movie" | "OVA") || "TV",
    season: a.season || "2024",
    releaseYear: a.releaseYear || 2024,
    totalEpisodes: a.totalEpisodes || "?",
    studio: a.studio || "",
    views: a.views || 0,
    episodes: [],
  }));

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumb & Header */}
      <div className="bg-[#121522] border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-gray-300">الرئيسية</Link>
            <span>/</span>
            <Link href="/genres" className="hover:text-gray-300">التصنيفات</Link>
            <span>/</span>
            <span className="text-white font-bold">{decodedGenre}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Layers className="w-7 h-7 text-gray-300" />
            أنميات تصنيف: {decodedGenre}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            تم العثور على <strong className="text-white">{formattedAnimes.length} أنمي</strong> ضمن تصنيف {decodedGenre}.
          </p>
        </div>
      </div>

      {/* Grid */}
      {formattedAnimes.length === 0 ? (
        <div className="bg-[#121520] border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
          لم يتم العثور على أنميات مسجلة ضمن هذا التصنيف حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {formattedAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
