import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, LayoutGrid, List } from "lucide-react";
import witScheduleData from "@/data/witScheduleEnriched.json";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مواعيد الحلقات | جدول صدور الأنميات الأسبوعي | راست أنمي",
  description: "جدول مواعيد صدور حلقات مسلسلات الأنمي المستمرة لهذا الموسم مطابق تماماً لجدول مواعيد الحلقات المعتمد.",
};

interface AnimeItem {
  slug: string;
  title: string;
  poster: string;
  type: string;
  rating: string;
  releaseYear: number;
  latestEpisode: number;
}

interface DayData {
  day: string;
  code: string;
  date: string;
  count: number;
  animes: AnimeItem[];
}

export default async function SchedulePage() {
  const schedule = witScheduleData as Record<string, DayData>;

  // Start with Today first (الأربعاء / Wednesday) matching WitAnime sequence
  const orderedDays = ["الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد", "الإثنين", "الثلاثاء"];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto">
      {/* Page Header matching WitAnime */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            مواعيد الحلقات
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 font-medium">
            تابِع حلقات الأنمي التي تُعرض على مدار الأسبوع
          </p>
        </div>

        {/* View mode toggle matching WitAnime */}
        <div className="inline-flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold shadow-sm transition-all">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>عرض شبكي</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs font-medium transition-all">
            <List className="w-3.5 h-3.5" />
            <span>عرض قائمة</span>
          </button>
        </div>
      </div>

      {/* Vertical Timeline Sections */}
      <div className="relative flex flex-col gap-12 sm:gap-14">
        {/* Continuous Vertical Rail on the start edge in RTL */}
        <div
          className="absolute start-[25px] top-6 bottom-6 hidden w-px bg-neutral-800 sm:block sm:start-[33px]"
          aria-hidden="true"
        />

        {orderedDays.map((dayName) => {
          const dayData = schedule[dayName];
          if (!dayData || !dayData.animes || dayData.animes.length === 0) return null;

          const isToday = dayName === "الأربعاء";

          return (
            <section key={dayName} className="relative space-y-5">
              {/* Day Header Row */}
              <div className="flex items-center gap-4">
                {/* Day Badge Box */}
                <div
                  className={`h-[52px] w-[52px] sm:h-[68px] sm:w-[68px] rounded-2xl shrink-0 flex flex-col items-center justify-center relative z-10 font-black transition-all ${
                    isToday
                      ? "border border-white bg-white text-black shadow-lg shadow-white/10"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-200"
                  }`}
                >
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isToday ? "opacity-75" : "text-neutral-400"}`}>
                    {dayData.code}
                  </span>
                  <span className="text-xs sm:text-sm font-black mt-0.5">
                    {dayData.date?.split(" ")[0] || ""}
                  </span>
                </div>

                {/* Day Name and Badges */}
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {dayData.day}
                  </h2>

                  {isToday && (
                    <span className="inline-flex h-6 items-center rounded-full bg-white/20 border border-white/30 px-3 text-xs font-extrabold text-white">
                      اليوم
                    </span>
                  )}

                  <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                    {dayData.animes.length} أنمي
                  </span>
                </div>
              </div>

              {/* Responsive Cards Grid indented past the vertical rail */}
              <div className="grid grid-cols-2 gap-4 sm:ms-[84px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {dayData.animes.map((anime) => (
                  <Link
                    key={anime.slug}
                    href={`/anime/${anime.slug}`}
                    className="group flex flex-col focus:outline-none"
                  >
                    {/* Poster Card */}
                    <div className="relative mb-3 aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800/80">
                      <Image
                        src={anime.poster}
                        alt={anime.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                      />

                      {/* Top Badges */}
                      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-1.5 p-2">
                        {/* Type Badge */}
                        <span className="h-5 sm:h-6 rounded-md bg-white px-2 text-[10px] sm:text-xs font-black leading-5 sm:leading-6 text-black shadow-sm">
                          {anime.type}
                        </span>

                        {/* Episode Badge */}
                        <span className="h-5 sm:h-6 rounded-md bg-black/75 px-2 text-[10px] sm:text-xs font-bold leading-5 sm:leading-6 text-white backdrop-blur-sm border border-white/10 shadow-sm">
                          الحلقة {anime.latestEpisode}
                        </span>
                      </div>

                      {/* Subtle Bottom Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    {/* Anime Details below Poster */}
                    <div className="space-y-1">
                      <h3
                        dir="ltr"
                        className="truncate text-sm sm:text-base font-semibold leading-snug text-white group-hover:text-neutral-300 transition-colors"
                        title={anime.title}
                      >
                        {anime.title}
                      </h3>

                      <div
                        dir="ltr"
                        className="flex items-center gap-2.5 text-xs text-neutral-400 font-medium"
                      >
                        <span>{anime.releaseYear}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-600" />
                        <span className="flex items-center gap-1 text-white font-bold">
                          <Star className="w-3 h-3 fill-white text-white" />
                          {anime.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
