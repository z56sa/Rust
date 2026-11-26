"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, PlayCircle, Heart, Plus, ChevronDown, Check, X, BookmarkCheck } from "lucide-react";

interface AnimeActionButtonsProps {
  animeId: string;
  slug: string;
  title: string;
  firstEpisodeNumber?: number;
  trailerUrl?: string | null;
  hasEpisodes?: boolean;
}

export function AnimeActionButtons({
  animeId,
  slug,
  title,
  firstEpisodeNumber = 1,
  trailerUrl,
  hasEpisodes = true,
}: AnimeActionButtonsProps) {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read from localStorage as immediate persistent cache for instant offline responsiveness
    try {
      const cached = localStorage.getItem(`anime_status_${animeId}`);
      if (cached) setCurrentStatus(cached);
      const favCached = localStorage.getItem(`anime_fav_${animeId}`);
      if (favCached) setIsFavorite(favCached === "true");
    } catch (e) {}

    // Fetch initial status from server
    fetch(`/api/user/list?animeId=${animeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setCurrentStatus(data.status);
          localStorage.setItem(`anime_status_${animeId}`, data.status);
        }
        if (typeof data.isFavorite === "boolean") {
          setIsFavorite(data.isFavorite);
          localStorage.setItem(`anime_fav_${animeId}`, String(data.isFavorite));
        }
      })
      .catch(() => {});
  }, [animeId]);

  const handleSetStatus = async (status: string) => {
    // If selecting current status, or "none", toggle off/remove
    const newStatus = status === "none" || status === currentStatus ? null : status;
    setCurrentStatus(newStatus);
    setMenuOpen(false);

    try {
      if (newStatus) {
        localStorage.setItem(`anime_status_${animeId}`, newStatus);
      } else {
        localStorage.removeItem(`anime_status_${animeId}`);
      }
    } catch (e) {}

    try {
      await fetch("/api/user/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, status: newStatus || "none" }),
      });
    } catch (e) {}
  };

  const handleToggleFavorite = async () => {
    const nextFav = !isFavorite;
    setIsFavorite(nextFav);
    try {
      localStorage.setItem(`anime_fav_${animeId}`, String(nextFav));
    } catch (e) {}

    try {
      await fetch("/api/user/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, isFavoriteToggle: true }),
      });
    } catch (e) {}
  };

  const getStatusLabel = () => {
    if (currentStatus === "watching") return "أشاهده";
    if (currentStatus === "plan") return "أنوي مشاهدته";
    if (currentStatus === "completed") return "أكملته";
    return "أضِف إلى القائمة";
  };

  const [activeTrailerEmbed, setActiveTrailerEmbed] = useState<string | null>(null);

  // Fetch or resolve real trailer embed URL
  const handleOpenTrailer = async () => {
    setTrailerOpen(true);
    if (trailerUrl && trailerUrl.startsWith("http")) {
      setActiveTrailerEmbed(trailerUrl);
      return;
    }
    try {
      const res = await fetch(`/api/trailer?title=${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.embedUrl) {
          setActiveTrailerEmbed(data.embedUrl);
          return;
        }
      }
    } catch (e) {}
    setActiveTrailerEmbed(`https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(title + " anime trailer")}&autoplay=1`);
  };

  return (
    <div className="relative z-30 flex flex-wrap items-center gap-3 pt-3">
      {/* 1. شاهد الآن */}
      {hasEpisodes ? (
        <Link
          href={`/anime/${slug}/watch/${firstEpisodeNumber}`}
          className="h-11 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/10 transition-all transform hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 fill-black text-black" />
          <span>شاهد الآن</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setTrailerOpen(true)}
          className="h-11 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <PlayCircle className="w-4 h-4 text-rose-500" />
          <span>لم يعرض بعد (مشاهدة الإعلان)</span>
        </button>
      )}

      {/* 2. الإعلان الرسمي في يوتيوب */}
      <button
        onClick={handleOpenTrailer}
        className="h-11 px-4 rounded-xl bg-[#141724] hover:bg-[#1a1f30] text-neutral-200 hover:text-white border border-neutral-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
      >
        <PlayCircle className="w-4 h-4 text-white" />
        <span>الإعلان</span>
      </button>

      {/* 3. أضِف إلى القائمة (Dropdown) */}
      <div className="relative z-40">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            currentStatus
              ? "bg-white text-black border-white shadow-md shadow-white/10"
              : "bg-[#141724] hover:bg-[#1a1f30] text-neutral-200 border-neutral-800"
          }`}
        >
          {currentStatus ? <BookmarkCheck className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4" />}
          <span>{getStatusLabel()}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>

        {menuOpen && (
          <div className="absolute start-0 top-12 z-50 w-44 bg-[#181a24] border border-neutral-700/80 rounded-xl shadow-2xl py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => handleSetStatus("watching")}
              className={`w-full text-right px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-neutral-800 transition-colors cursor-pointer ${
                currentStatus === "watching" ? "text-white font-bold bg-neutral-800" : "text-neutral-300"
              }`}
            >
              <span>أشاهده</span>
              {currentStatus === "watching" && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <button
              onClick={() => handleSetStatus("plan")}
              className={`w-full text-right px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-neutral-800 transition-colors cursor-pointer ${
                currentStatus === "plan" ? "text-white font-bold bg-neutral-800" : "text-neutral-300"
              }`}
            >
              <span>أنوي مشاهدته</span>
              {currentStatus === "plan" && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <button
              onClick={() => handleSetStatus("completed")}
              className={`w-full text-right px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-neutral-800 transition-colors cursor-pointer ${
                currentStatus === "completed" ? "text-white font-bold bg-neutral-800" : "text-neutral-300"
              }`}
            >
              <span>أكملته</span>
              {currentStatus === "completed" && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        )}
      </div>

      {/* 4. المفضلة (Heart button) */}
      <button
        onClick={handleToggleFavorite}
        className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
          isFavorite
            ? "bg-rose-500/20 text-rose-500 border-rose-500/40"
            : "bg-[#141724] hover:bg-[#1a1f30] text-neutral-400 hover:text-white border-neutral-800"
        }`}
        title="أضف للمفضلة"
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {/* Trailer Modal (Official Trailer YouTube Player) */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-[#0f1118] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#141824]">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm text-white">
                  الإعلان الرسمي (Trailer) - {title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " anime official trailer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                >
                  فتح في YouTube ↗
                </a>
                <button
                  onClick={() => setTrailerOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* YouTube Embed Container */}
            <div className="relative aspect-video w-full bg-black">
              {activeTrailerEmbed ? (
                <iframe
                  src={activeTrailerEmbed}
                  title={`الإعلان الرسمي - ${title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-3">
                  <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">جارٍ تحميل الإعلان الرسمي...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
