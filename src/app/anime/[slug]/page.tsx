import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAnimeBySlug } from "@/lib/animeService";
import { Star, PlayCircle, Play } from "lucide-react";
import { AnimeActionButtons } from "@/components/AnimeActionButtons";
import { EpisodeThumbnail } from "@/components/EpisodeThumbnail";

export const revalidate = 60;

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anime = await getAnimeBySlug(slug);

  if (!anime) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Banner & Overview */}
      <div className="relative rounded-2xl border border-gray-800 bg-[#0f121d] p-6 md:p-8">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <Image
            src={anime.banner}
            alt={anime.title}
            fill
            priority
            className="object-cover opacity-20 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/85 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          {/* Poster */}
          <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-gray-700/60 flex-shrink-0 bg-gray-900">
            <Image
              src={anime.poster}
              alt={anime.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Metadata */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded">
                {anime.type}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded border font-semibold ${
                  anime.status === "مستمر"
                    ? "bg-emerald-600/30 text-emerald-400 border-emerald-500/30"
                    : "bg-neutral-800 text-neutral-300 border-neutral-700"
                }`}
              >
                {anime.status === "مستمر" ? "مستمر" : "مكتمل"}
              </span>
              <span className="bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 border border-white/20">
                <Star className="w-3.5 h-3.5 fill-white" />
                {anime.rating} / 10
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{anime.title}</h1>
              <p className="text-sm text-gray-400 mt-1 font-mono">{anime.japaneseTitle}</p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
              {anime.synopsis}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131622]/90 p-4 rounded-xl border border-gray-800/80 text-xs">
              <div>
                <span className="text-gray-500 block">الاستوديو</span>
                <span className="text-gray-200 font-semibold">{anime.studio || "Madhouse"}</span>
              </div>
              <div>
                <span className="text-gray-500 block">سنة الإنتاج</span>
                <span className="text-gray-200 font-semibold">{anime.releaseYear}</span>
              </div>
              <div>
                <span className="text-gray-500 block">عدد الحلقات</span>
                <span className="text-gray-200 font-semibold">{anime.totalEpisodes}</span>
              </div>
              <div>
                <span className="text-gray-500 block">المشاهدات</span>
                <span className="text-gray-200 font-semibold">{anime.views?.toLocaleString()}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {anime.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700/50"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Action Buttons: شاهد الآن + الإعلان الرسمي + أضف إلى القائمة + المفضلة */}
            <AnimeActionButtons
              animeId={anime.id}
              slug={anime.slug}
              title={anime.title}
              firstEpisodeNumber={anime.episodes.length > 0 ? anime.episodes[0].number : 1}
              trailerUrl={(anime as any).trailerUrl}
              hasEpisodes={anime.episodes.length > 0}
            />
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <span className="w-2.5 h-6 bg-rose-600 rounded-full" />
          <h2 className="text-lg font-bold text-white">قائمة الحلقات المتوفرة ({anime.episodes.length})</h2>
        </div>

        {anime.episodes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-[#121520] rounded-xl border border-gray-800">
            لم يتم رفع حلقات لهذا الأنمي بعد. يمكنك إضافة حلقات من لوحة التحكم (Admin).
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {anime.episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/anime/${anime.slug}/watch/${ep.number}`}
                className="group bg-[#141824] border border-gray-800/80 rounded-xl p-3 hover:border-rose-500/50 hover:bg-[#181d2e] transition-all flex items-center gap-3"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  <EpisodeThumbnail
                    src={ep.thumbnail || anime.poster}
                    fallbackSrc={anime.poster}
                    alt={ep.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-rose-400 block">
                    الحلقة {ep.number}
                  </span>
                  <h4 className="text-xs text-gray-200 truncate mt-0.5 group-hover:text-white">
                    {ep.title}
                  </h4>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    {ep.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
