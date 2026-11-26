import Link from "next/link";
import Image from "next/image";
import { getMoviesPaginated, getTopWatchedMovies } from "@/lib/animeService";
import { Star } from "lucide-react";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Pagination } from "@/components/Pagination";
import {
  animeReleaseYears,
  animeCountriesList,
  animeVersionsList,
} from "@/data/filterOptions";

export const dynamic = "force-dynamic";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params?.page || "1", 10));

  const [paginatedData, topMovies] = await Promise.all([
    getMoviesPaginated(currentPage, 18),
    getTopWatchedMovies(10),
  ]);

  const { items: allMovies, totalPages, totalCount } = paginatedData;

  return (
    <div className="space-y-8">
      {/* 2-Column Main Layout matching WitAnime */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Content Area (على اليمين في RTL) */}
        <main className="flex-1 w-full lg:w-[78%] space-y-6 min-w-0">
          
          {/* Page Title & Subtitle */}
          <div className="border-b border-zinc-800/80 pb-4 text-right">
            <h1 className="text-2xl sm:text-3xl font-black text-white">أفلام الأنمي</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              اكتشف أفضل أفلام الأنمي من الكلاسيكيات إلى الإصدارات الجديدة
            </p>
          </div>

          {/* Filters Form matching WitAnime screenshot */}
          <div className="bg-[#121520]/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
              
              <FilterDropdown
                label="التصنيف"
                options={["الكل", "أكشن", "مغامرات", "دراما", "رعب", "خيال علمي", "رومانسي"]}
              />

              <FilterDropdown
                label="السنة"
                options={animeReleaseYears}
              />

              <FilterDropdown
                label="النسخة"
                options={animeVersionsList}
              />

              <FilterDropdown
                label="البلد"
                options={animeCountriesList}
              />

            </div>

            <div className="flex justify-end pt-2">
              <button className="px-6 py-2 bg-white text-black font-bold text-xs rounded-xl shadow-md hover:bg-zinc-200 transition">
                تطبيق التصفية
              </button>
            </div>
          </div>

          {/* Results count & Sorting */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono">عرض 18 من {totalCount} فيلم (الصفحة {currentPage} من {totalPages})</span>
            <div className="flex items-center gap-2">
              <span>ترتيب حسب:</span>
              <select className="bg-[#181b28] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none">
                <option>الأحدث مضافاً</option>
                <option>الأحدث إصداراً</option>
                <option>الأعلى تقييماً</option>
                <option>الأكثر مشاهدة</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          {/* Movies Grid (18 items only) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {allMovies.map((item) => (
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
                  <div className="absolute top-2 left-2 bg-zinc-900/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                    فيلم
                  </div>
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white font-mono">
                    {item.releaseYear || 2024}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="p-2.5 text-right">
                  <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-300 font-mono">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                      {item.rating || "8.0"}
                    </span>
                    <span className="bg-zinc-800 px-1 py-0.5 rounded text-[9px]">FHD</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Component matching WitAnime */}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/movies" />

        </main>

        {/* Sidebar: الأعلى تقييماً (TOP 10 Movies) على اليسار */}
        <aside className="w-full lg:w-[22%] shrink-0 space-y-4">
          <div className="bg-[#10121a] border border-zinc-800/80 rounded-2xl p-4 sticky top-20 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-3">
              <span className="w-1.5 h-5 bg-white rounded-full" />
              <h2 className="text-base font-bold text-white">الأعلى تقييماً</h2>
            </div>

            <div className="space-y-2">
              {topMovies.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/anime/${item.slug}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-zinc-800/60 transition group border border-transparent hover:border-zinc-700/50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      <img
                        src={item.poster || "/logo.png"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        {item.rating || "8.5"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-zinc-600 font-mono">
                    {idx + 1}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
