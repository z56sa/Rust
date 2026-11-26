import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";
import { AuthNavButton } from "@/components/AuthNavButton";
import { AdminNavLink } from "@/components/AdminNavLink";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#0e1017]/95 backdrop-blur-md border-b border-zinc-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Right side: Logo + Navigation Links (exact WitAnime order & clean text) */}
        <div className="flex items-center gap-7">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="انمي راست | AnimeRust"
                width={32}
                height={32}
                className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition duration-200"
                priority
              />
            </div>
            <span className="font-black text-lg tracking-wide text-white">RUSTANIME</span>
          </Link>

          {/* Navigation Links - Plain clean text without icons, exactly like WitAnime */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <Link href="/anime" className="hover:text-white transition-colors">
              قائمة الأنمي
            </Link>
            <Link href="/movies" className="hover:text-white transition-colors">
              أفلام
            </Link>
            <Link href="/seasonal" className="hover:text-white transition-colors">
              أنميات الموسم
            </Link>
            <Link href="/schedule" className="hover:text-white transition-colors">
              مواعيد الحلقات
            </Link>
            <AdminNavLink />
          </nav>
        </div>

        {/* Left side: Search Bar & Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />
          <AuthNavButton />
        </div>
      </div>
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-[#0b0d14] border-t border-zinc-800/80 text-zinc-400 text-sm mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="font-extrabold text-lg text-zinc-300">RUST</span>
            <span className="font-bold text-lg text-white">ANIME</span>
          </div>
          <p className="text-xs text-zinc-500 max-w-md">
            موقع انمي راست (AnimeRust) وجهتك المثالية لمتابعة واستكشاف محتوى الأنمي المترجم بسهولة وسرعة.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
          <Link href="/anime" className="hover:text-white transition-colors">قائمة الأنمي</Link>
          <Link href="/movies" className="hover:text-white transition-colors">أفلام</Link>
          <Link href="/seasonal" className="hover:text-white transition-colors">أنميات الموسم</Link>
          <Link href="/schedule" className="hover:text-white transition-colors">مواعيد الحلقات</Link>
          <Link href="#" className="hover:text-white transition-colors">اتصل بنا</Link>
        </div>
      </div>
    </footer>
  );
};
