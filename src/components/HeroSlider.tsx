"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Star } from "lucide-react";

export interface HeroSlide {
  index: number;
  title: string;
  fullTitle?: string;
  slug: string;
  banner: string;
  type: string;
  rating: number;
  year: number;
  episodes?: string | null;
  status: string;
  genres: string;
  synopsis: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    // Auto-advance every 3.5 seconds
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[current] || slides[0];

  return (
    <section
      className="relative w-full rounded-2xl overflow-hidden min-h-[420px] bg-[#07080c] group border border-zinc-900 shadow-2xl"
    >
      {/* 
        Two-column structure identical to WitAnime:
        In RTL:
        Right Column: Text Content + Actions (Pure Solid Black, 52% width)
        Left Column: Anime Illustration with soft edge fade (48% width)
      */}
      <div className="relative w-full min-h-[420px] flex flex-col md:flex-row items-center">
        
        {/* Right Half: Solid Black Background with Text & Controls */}
        <div className="w-full md:w-[52%] p-6 sm:p-10 md:p-14 z-10 flex flex-col justify-center text-right space-y-4">
          
          {/* Main Title - Clean and properly sized so it fits cleanly */}
          <h1
            dir="ltr"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide leading-tight text-right line-clamp-2"
            title={activeSlide.fullTitle || activeSlide.title}
          >
            {activeSlide.title}
          </h1>

          {/* 
            Metadata Row: Ordered specifically starting from right to left in RTL:
            [TV] [Rating ★] [Year] [Episodes] [Status] [Genres]
          */}
          <div className="flex flex-wrap items-center justify-start gap-2 text-xs">
            {/* TV Badge on the far right */}
            <span className="bg-white text-black font-black px-2 py-0.5 rounded text-[11px] shadow-sm">
              {activeSlide.type || "TV"}
            </span>

            {/* Rating badge */}
            <span dir="ltr" className="bg-black/60 text-white font-bold px-2 py-0.5 rounded border border-zinc-700/80 flex items-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>{activeSlide.rating}</span>
            </span>

            {/* Release Year */}
            <span className="text-zinc-400 font-mono text-xs">{activeSlide.year}</span>
            
            {/* Episodes */}
            {activeSlide.episodes && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-xs">{activeSlide.episodes}</span>
              </>
            )}

            {/* Status */}
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-medium text-xs">{activeSlide.status}</span>

            {/* Genres */}
            {activeSlide.genres && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-xs">{activeSlide.genres}</span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg">
            {activeSlide.synopsis}
          </p>

          {/* Call to action button */}
          <div className="pt-2">
            <Link
              href={`/anime/${activeSlide.slug}/watch/1`}
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-7 py-2.5 rounded-full font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <span>شاهد الآن</span>
              <Play className="w-3.5 h-3.5 fill-black" />
            </Link>
          </div>

        </div>

        {/* Left Half: Anime Artwork strictly confined to the Left */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[50%] h-full overflow-hidden pointer-events-none z-0">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.slug + idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.banner}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
                {/* 
                  Gradients fading towards right (into the black text zone) 
                  and softly towards top/bottom
                */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#07080c]/30 to-[#07080c]" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07080c] to-transparent" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07080c] to-transparent" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Pagination Dots (At the bottom center/right) */}
      <div className="absolute bottom-5 right-8 sm:right-16 z-20 flex items-center gap-1.5">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setCurrent(dotIdx)}
            className={`transition-all rounded-full ${
              dotIdx === current
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
            aria-label={`شريحة ${dotIdx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
