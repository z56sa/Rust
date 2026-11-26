import Link from "next/link";
import Image from "next/image";
import { getOngoingAnimesPaginated, getSeasonalPopularAnimes } from "@/lib/animeService";
import { Star, Calendar } from "lucide-react";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

export default async function SeasonalPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params?.page || "1", 10));

  const [paginatedData, seasonalTop] = await Promise.all([
    getOngoingAnimesPaginated(currentPage, 18),
    getSeasonalPopularAnimes(10),
  ]);

  const { items: ongoingList, totalPages, totalCount } = paginatedData;

  return (
    <div className="space-y-8">
      {/* 2-Column Main Layout matching WitAnime */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Content Area (على اليمين في RTL) */}
        <main className="flex-1 w-full lg:w-[78%] space-y-6 min-w-0">
          
          {/* Page Title & Subtitle with Season Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 text-right">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">أنميات خريف 2026</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                الأنميات التي تعرض هذا الموسم (الصفحة {currentPage} من {totalPages})
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-[#121520] border border-zinc-800 px-4 py-2 rounded-xl text-xs text-zinc-300 self-start sm:self-auto">
              <Calendar className="w-4 h-4 text-white" />
              <div className="text-right">
                <span className="block font-bold text-white">خريف 2026</span>
                <span className="text-[10px] text-zinc-400 font-mono">{totalCount} أنمي هذا الموسم</span>
              </div>
            </div>
          </div>

          {/* Seasonal Grid (18 items only per page) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {ongoingList.map((item) => (
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
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                    {item.type || "TV"}
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
                      {item.rating || "8.5"}
                    </span>
                    <span className="text-emerald-400 text-[10px]">مستمر</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Component matching WitAnime */}
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/seasonal" />

        </main>

        {/* Sidebar: الأكثر مشاهدة — صيف 2026 (على اليسار في RTL) */}
        <aside className="w-full lg:w-[22%] shrink-0 space-y-4">
          <div className="bg-[#10121a] border border-zinc-800/80 rounded-2xl p-4 sticky top-20 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 mb-3">
              <span className="w-1.5 h-5 bg-white rounded-full" />
              <h2 className="text-base font-bold text-white">الأكثر مشاهدة — خريف 2026</h2>
            </div>

            <div className="space-y-2">
              {seasonalTop.map((item, idx) => (
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
