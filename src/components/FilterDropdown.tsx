"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  defaultValue?: string;
  onChange?: (val: string) => void;
}

export function FilterDropdown({
  label,
  options,
  defaultValue,
  onChange,
}: FilterDropdownProps) {
  const [selected, setSelected] = useState(defaultValue || options[0] || "الكل");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="text-[11px] font-bold text-zinc-400 block text-right">{label}</label>
      
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#181b28] hover:bg-[#1e2233] border border-zinc-800 hover:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 flex items-center justify-between transition focus:outline-none"
      >
        <span className="truncate">{selected}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* WitAnime Exact Popup Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-full min-w-[180px] max-h-60 overflow-y-auto bg-[#1c1f2e] border border-zinc-700/80 rounded-2xl p-1.5 shadow-2xl z-50 custom-scrollbar text-right">
          <div className="px-2 py-1 text-[11px] font-bold text-zinc-400 border-b border-zinc-700/60 mb-1">
            {label}
          </div>
          {options.map((opt) => {
            const isSelected = opt === selected;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                  if (onChange) onChange(opt);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition ${
                  isSelected
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
