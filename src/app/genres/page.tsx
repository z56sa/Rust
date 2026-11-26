import React from "react";
import Link from "next/link";
import { getAllGenresWithCount } from "@/lib/animeService";
import { Layers, Flame, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "تصنيفات الأنمي | رست أنمي",
  description: "تصفح مسلسلات وأفلام الأنمي حسب التصنيف مثل أكشن، مغامرات، كوميديا، دراما، شونين، خيال والمزيد.",
};

export default async function GenresPage() {
  const genres = await getAllGenresWithCount();

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-[#121522] border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-300 font-bold text-xs mb-1">
            <Layers className="w-4 h-4 text-white" />
            <span>تصنيفات الأنمي (Genres)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            جميع تصنيفات الأنمي
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            اختر التصنيف المفضل لديك لاستعراض مئات الأنميات المترجمة بأعلى جودة وسيرفرات سريعة.
          </p>
        </div>

        <div className="bg-[#181d2e] border border-gray-700/60 p-3.5 rounded-xl flex items-center gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-white" />
          <div>
            <div className="text-gray-400 text-[11px]">عدد التصنيفات:</div>
            <div className="font-bold text-white">{genres.length} تصنيف متنوع</div>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {genres.map((g) => (
          <Link
            key={g.name}
            href={`/genres/${encodeURIComponent(g.name)}`}
            className="group bg-[#121520] hover:bg-[#181d2e] border border-gray-800/80 hover:border-gray-500 p-4 rounded-xl flex items-center justify-between transition-all shadow-sm hover:shadow-md hover:shadow-black/50"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-white text-black group-hover:scale-125 transition-transform" />
              <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                {g.name}
              </span>
            </div>
            <span className="text-xs font-mono bg-black/40 text-gray-400 px-2 py-0.5 rounded-md border border-gray-800 group-hover:border-gray-500 group-hover:text-white">
              {g.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
