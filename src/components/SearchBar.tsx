"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Star, X } from "lucide-react";

interface AnimeResult {
  id: string;
  slug: string;
  title: string;
  japaneseTitle?: string;
  poster: string;
  rating: number;
  status: string;
  type: string;
  releaseYear: number;
}

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs sm:w-72">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="ابحث في Rust Anime..."
          className="w-full bg-[#181b29] border border-gray-700/60 rounded-full py-1.5 pr-10 pl-8 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-2.5" />
        
        {loading && (
          <Loader2 className="w-3.5 h-3.5 text-gray-300 animate-spin absolute left-3 top-3" />
        )}

        {query && !loading && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute left-3 top-2.5 text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full sm:w-80 left-0 sm:right-0 bg-[#121522] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-gray-800/80 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 hover:bg-gray-800/60 transition-colors group"
              >
                <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  <Image
                    src={anime.poster}
                    alt={anime.title}
                    fill
                    sizes="44px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-100 group-hover:text-white transition-colors truncate">
                    {anime.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                    <span className="text-white flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      {anime.rating}
                    </span>
                    <span>•</span>
                    <span>{anime.releaseYear}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{anime.status}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              لا توجد نتائج مطابقة لـ &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};
