"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogIn, LogOut, Bookmark, ChevronDown } from "lucide-react";

export function AuthNavButton() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/user_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-white hover:bg-neutral-200 text-black shadow-sm transition-all"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>دخول</span>
      </Link>
    );
  }

  const avatarUrl = user && (user as any).avatar && (user as any).avatar.startsWith("/avatars/") ? (user as any).avatar : "/avatars/02.png";

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-white/20 transition-all focus:outline-none"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 bg-neutral-800">
          <Image
            src={avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      </button>

      {/* User Dropdown matching WitAnime style in image */}
      {dropdownOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-11 z-50 w-52 bg-[#161616] border border-neutral-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-neutral-800/80 mb-1">
            <span className="font-black text-xs text-white block">{user.name}</span>
            <span className="text-[10px] text-neutral-400 block truncate" dir="ltr">{user.email}</span>
          </div>

          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <User className="w-4 h-4 text-neutral-400" />
            <span>الملف الشخصي</span>
          </Link>

          <Link
            href="/profile/lists"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-neutral-400" />
            <span>قائمتي</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-right mt-1 border-t border-neutral-800/60 pt-2"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
