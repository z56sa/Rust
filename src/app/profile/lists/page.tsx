"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Bookmark, Star, Play } from "lucide-react";

export default function UserListsPage() {
  const [activeTab, setActiveTab] = useState<"watching" | "plan" | "completed" | "favorite">("watching");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    fetch("/api/user/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.list && Array.isArray(data.list)) {
          setItems(data.list);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered = items.filter((x) => x.status === activeTab);

  const tabLabels = [
    { key: "favorite", label: "المفضلة" },
    { key: "watching", label: "أشاهده" },
    { key: "completed", label: "أكملته" },
    { key: "plan", label: "أنوي مشاهدته" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/profile" className="hover:text-white transition-colors">
          العودة إلى الملف الشخصي
        </Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">قائمتي</h1>
        <p className="text-xs text-neutral-400 mt-1">أدِر مجموعتك من الأنمي والأفلام</p>
      </div>

      {/* Tabs Row matching WitAnime */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        {tabLabels.map((tab) => {
          const count = items.filter((x) => x.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-[#141724] text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/15 text-black font-extrabold" : "bg-neutral-800 text-neutral-300"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[#121522] border border-neutral-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 my-8">
          <Bookmark className="w-12 h-12 text-neutral-600 mb-2" />
          <h3 className="text-base font-bold text-white">لا يوجد شيء في هذه القائمة</h3>
          <p className="text-xs text-neutral-400">ابدأ بإضافة الأنمي والأفلام إلى مجموعتك</p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/"
              className="px-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-neutral-200 transition-all shadow"
            >
              تصفح الأنمي
            </Link>
          </div>
        </div>
      ) : (
        /* Anime Cards Grid in List */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/anime/${item.anime?.slug || item.animeId}`}
              className="group flex flex-col bg-[#141824] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-500 transition-all"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
                {item.anime?.poster && (
                  <Image
                    src={item.anime.poster}
                    alt={item.anime.title || "Anime"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {item.anime?.rating || 8.5}
                </div>
              </div>
              <div className="p-2.5 space-y-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-neutral-300 transition-colors">
                  {item.anime?.title || item.animeId}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{item.anime?.type || "TV"}</span>
                  <span>{item.anime?.releaseYear || "2024"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
