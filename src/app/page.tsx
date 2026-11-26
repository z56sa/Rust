import Link from "next/link";
import Image from "next/image";
import {
  getAllAnimes,
  getLatestEpisodesWithAnime,
  getOngoingAnimes,
  getSeasonalPopularAnimes,
  getTopWatchedAnimes,
  getLatestMovies,
  getTopWatchedMovies,
} from "@/lib/animeService";
import { EpisodeCard } from "@/components/AnimeCard";
import { Star, ChevronLeft, ChevronRight, Film, Clock, Play } from "lucide-react";
import { Anime } from "@/data/animeData";
import witHeroSlides from "@/data/witHeroSlides.json";
import { HeroSlider } from "@/components/HeroSlider";
import { ContinueWatching } from "@/components/ContinueWatching";
import { RankedSliderSection } from "@/components/RankedSliderSection";
import { LatestMoviesSection } from "@/components/LatestMoviesSection";

export const revalidate = 60;

export default async function Home() {
  const [
    allAnimes,
    latestEpisodes,
    seasonalAnimes,
    topWatchedAnimes,
    latestMovies,
    topWatchedMovies,
  ] = await Promise.all([
    getAllAnimes(24),
    getLatestEpisodesWithAnime(18),
    getSeasonalPopularAnimes(14),
    getTopWatchedAnimes(6),
    getLatestMovies(12),
    getTopWatchedMovies(6),
  ]);

  return (
    <div className="space-y-12">
      {/* 1. البانر الرئيسي - سلايدر هيرو عريض */}
      <HeroSlider slides={witHeroSlides} />

      {/* 2. الهيكل ثنائي الأعمدة مطابقة كاملة لشاشة WitAnime:
          في اتجاه RTL:
          العنصر الأول في الـ DOM يظهر على اليمين (المحتوى الرئيسي 78%-80%)
          العنصر الثاني في الـ DOM يظهر على اليسار (الشريط الجانبي "أشهر أنميات الموسم" 20%-22%)
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* المحتوى الرئيسي (على اليمين) */}
        <main className="flex-1 w-full lg:w-[78%] space-y-12 min-w-0">
          
          {/* الأكثر مشاهدة (حلقات) 6 بوسترات كبار مع أرقام الرتب */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-white rounded-full" />
                <h2 className="text-lg font-bold text-white">الأكثر مشاهدة</h2>
              </div>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                حلقات
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
              {topWatchedAnimes.slice(0, 6).map((item, idx) => (
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
                      loading="lazy" referrerPolicy="no-referrer" onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "/brand-logo.jpg"; }}
                    />
                    {/* الرتبة 1, 2, 3.. */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white text-black font-black text-xs rounded-md flex items-center justify-center shadow-lg">
                      {idx + 1}
                    </div>
                    {/* التقييم */}
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      {item.rating ? Number(item.rating).toFixed(1) : "8.5"}
                    </div>
                  </div>
                  <div className="p-2.5 text-right">
                    <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* أحدث الحلقات (شبكة الحلقات) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-white rounded-full" />
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  أحدث الحلقات
                </h2>
              </div>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md font-medium">
                محدث
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {latestEpisodes.map(({ anime, episode }) => (
                <EpisodeCard
                  key={episode.id}
                  anime={anime as unknown as Anime}
                  episode={episode as any}
                />
              ))}
            </div>
          </section>

          {/* تابع المشاهدة */}
          <ContinueWatching />

          {/* أحدث الأفلام */}
          <LatestMoviesSection movies={latestMovies as any} />

          {/* أكثر الأنميات مشاهدة (كل الأوقات) */}
          <RankedSliderSection
            title="أكثر الأنميات مشاهدة"
            badge="كل الأوقات"
            viewAllLink="/anime"
            items={topWatchedAnimes as any}
          />

          {/* أكثر الأفلام مشاهدة */}
          <RankedSliderSection
            title="أكثر الأفلام مشاهدة"
            badge="كل الأوقات"
            viewAllLink="/movies"
            items={topWatchedMovies as any}
          />

        </main>

        {/* الشريط الجانبي: أشهر أنميات الموسم (على اليسار في RTL) */}
        <aside className="w-full lg:w-[22%] shrink-0 space-y-4">
          <div className="bg-[#10121a] border border-zinc-800/80 rounded-2xl p-4 sticky top-20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-white rounded-full" />
                <h2 className="text-sm font-bold text-white">أشهر أنميات الموسم</h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {seasonalAnimes.slice(0, 15).map((anime, idx) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.slug}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-zinc-800/60 transition group border border-transparent hover:border-zinc-700/50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800 group-hover:border-zinc-500 transition">
                      <img
                        src={anime.poster || "/logo.png"}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        loading="lazy" referrerPolicy="no-referrer" onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "/brand-logo.jpg"; }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-white truncate">
                      {anime.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* قسم تعريفي - انمي راست | AnimeRust (SEO & Description) */}
      <section className="bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm text-right">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
          انمي راست - AnimeRust
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
          أهلاً بك في <strong className="text-rose-500 font-semibold">انمي راست</strong> (<span className="text-white font-semibold">AnimeRust</span>)، موقع مخصص لعرض ومشاركة محتوى الأنمي وتفاصيله بواجهة سريعة ومباشرة وبدون إعلانات مزعجة.
        </p>
      </section>
    </div>
  );
}
