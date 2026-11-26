"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Bookmark, LogOut, Check, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [listCounts, setListCounts] = useState({
    favorite: 0,
    watching: 0,
    completed: 0,
    plan: 0,
  });

  useEffect(() => {
    const match = document.cookie.match(/user_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        setUser(parsed);
      } catch (e) {}
    }

    // Fetch lists
    fetch("/api/user/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.list && Array.isArray(data.list)) {
          const fav = data.list.filter((x: any) => x.status === "favorite").length;
          const w = data.list.filter((x: any) => x.status === "watching").length;
          const c = data.list.filter((x: any) => x.status === "completed").length;
          const p = data.list.filter((x: any) => x.status === "plan").length;
          setListCounts({
            favorite: fav,
            watching: w,
            completed: c,
            plan: p,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const userName = user?.name || "NORTH";
  const userEmail = user?.email || "hi423179@gmail.com";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Profile Card matching WitAnime */}
      <div className="bg-[#121522] border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-4 bg-neutral-800 shadow-xl">
          <Image
            src={user && (user as any).avatar && (user as any).avatar.startsWith("/avatars/") ? (user as any).avatar : "/avatars/edward.png"}
            alt={userName}
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white">{userName}</h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono" dir="ltr">{userEmail}</p>
        <span className="text-[11px] text-neutral-500 mt-1">انضم في نوفمبر 2026</span>

        {/* Counter Badges Grid matching WitAnime */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-lg mt-8">
          <div className="bg-[#181d2e] p-3 rounded-2xl border border-neutral-800/80 text-center">
            <span className="text-lg font-black text-white block">{listCounts.favorite}</span>
            <span className="text-[11px] text-neutral-400">المفضلة</span>
          </div>
          <div className="bg-[#181d2e] p-3 rounded-2xl border border-neutral-800/80 text-center">
            <span className="text-lg font-black text-white block">{listCounts.watching}</span>
            <span className="text-[11px] text-neutral-400">أشاهده</span>
          </div>
          <div className="bg-[#181d2e] p-3 rounded-2xl border border-neutral-800/80 text-center">
            <span className="text-lg font-black text-white block">{listCounts.completed}</span>
            <span className="text-[11px] text-neutral-400">أكملته</span>
          </div>
          <div className="bg-[#181d2e] p-3 rounded-2xl border border-neutral-800/80 text-center">
            <span className="text-lg font-black text-white block">{listCounts.plan}</span>
            <span className="text-[11px] text-neutral-400">أنوي مشاهدته</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button className="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs shadow-sm">
          نظرة عامة
        </button>
        <button className="px-5 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold">
          إعدادات الحساب
        </button>
      </div>

      {/* Menu Actions */}
      <div className="space-y-3">
        <Link
          href="/profile/lists"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#141724] border border-neutral-800 hover:border-neutral-600 transition-all text-right group"
        >
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-neutral-200">قائمتي</span>
            <span className="text-xs text-neutral-400">اعرض مجموعتك من الأنمي والأفلام وأدرها</span>
          </div>
          <Bookmark className="w-5 h-5 text-neutral-400 group-hover:text-white" />
        </Link>

        <Link
          href="/profile/avatar"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#141724] border border-neutral-800 hover:border-neutral-600 transition-all text-right group"
        >
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-neutral-200">تعديل الصورة الرمزية</span>
            <span className="text-xs text-neutral-400">غيّر صورة ملفك الشخصي</span>
          </div>
          <User className="w-5 h-5 text-neutral-400 group-hover:text-white" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/30 transition-all text-right group"
        >
          <div>
            <span className="text-sm font-bold text-rose-400 block">تسجيل الخروج</span>
            <span className="text-xs text-rose-300/70">الخروج من حسابك</span>
          </div>
          <LogOut className="w-5 h-5 text-rose-400" />
        </button>
      </div>
    </div>
  );
}
