"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, User, Loader2 } from "lucide-react";

// 32 Distinct Anime Characters (No Repetition)
const AVATAR_OPTIONS = [
  // Row 1 - 4
  { id: "01", url: "/avatars/01.png", name: "إيتشيغو (Ichigo)" },
  { id: "02", url: "/avatars/02.png", name: "زورو (Zoro)" },
  { id: "03", url: "/avatars/03.png", name: "لوفي (Luffy)" },
  { id: "04", url: "/avatars/04.png", name: "غوجو (Gojo)" },

  // Row 5 - 8
  { id: "05", url: "/avatars/05.png", name: "إيتاتشي (Itachi)" },
  { id: "06", url: "/avatars/06.png", name: "لولوش (Lelouch)" },
  { id: "07", url: "/avatars/07.png", name: "إيرين (Eren)" },
  { id: "08", url: "/avatars/08.png", name: "كيلوا (Killua)" },

  // Row 9 - 12
  { id: "09", url: "/avatars/09.png", name: "فريرين (Frieren)" },
  { id: "10", url: "/avatars/10.png", name: "ماكيما (Makima)" },
  { id: "11", url: "/avatars/11.png", name: "كاكاشي (Kakashi)" },
  { id: "12", url: "/avatars/12.png", name: "ناروتو (Naruto)" },

  // Row 13 - 16
  { id: "13", url: "/avatars/13.png", name: "نيزوكو (Nezuko)" },
  { id: "14", url: "/avatars/14.png", name: "تانجيرو (Tanjiro)" },
  { id: "15", url: "/avatars/15.png", name: "إدوارد (Edward)" },
  { id: "16", url: "/avatars/16.png", name: "ميكاسا (Mikasa)" },

  // Row 17 - 20 (Distinct Legends)
  { id: "levi", url: "/avatars/levi.png", name: "ليفاي (Levi)" },
  { id: "hinata", url: "/avatars/hinata.png", name: "هيناتا (Hinata)" },
  { id: "nami", url: "/avatars/nami.png", name: "نامي (Nami)" },
  { id: "sukuna", url: "/avatars/sukuna.png", name: "سوكونا (Sukuna)" },

  // Row 21 - 24
  { id: "yor", url: "/avatars/yor.png", name: "يور فورجر (Yor)" },
  { id: "vladilena", url: "/avatars/vladilena.png", name: "لينا (Lena)" },
  { id: "kaori", url: "/avatars/kaori.png", name: "كاوري (Kaori)" },
  { id: "saitama", url: "/avatars/saitama.png", name: "سايتاما (Saitama)" },

  // Row 25 - 28
  { id: "l_deathnote", url: "/avatars/l_deathnote.png", name: "إل (L)" },
  { id: "light_yagami", url: "/avatars/light_yagami.png", name: "لايت ياغامي (Light)" },
  { id: "guts", url: "/avatars/guts.png", name: "غاتس (Guts)" },
  { id: "kaneki", url: "/avatars/kaneki.png", name: "كانيكي (Kaneki)" },

  // Row 29 - 32
  { id: "sasuke", url: "/avatars/sasuke.png", name: "ساسكي (Sasuke)" },
  { id: "madara", url: "/avatars/madara.png", name: "مادارا (Madara)" },
  { id: "kurisu", url: "/avatars/kurisu.png", name: "كوريسو (Kurisu)" },
  { id: "kirito", url: "/avatars/kirito.png", name: "كيريتو (Kirito)" },
];

export default function AvatarPage() {
  const router = useRouter();
  const [currentName, setCurrentName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[1].url);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/user_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed.name) setCurrentName(parsed.name);
        if (parsed.avatar && parsed.avatar.startsWith("/avatars/")) {
          setSelectedAvatar(parsed.avatar);
        } else {
          setSelectedAvatar("/avatars/02.png");
        }
      } catch (e) {}
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentName,
          avatar: selectedAvatar,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/profile");
          router.refresh();
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {/* Back Link */}
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/profile" className="hover:text-white transition-colors">
          العودة إلى الملف الشخصي
        </Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          اختر صورتك الرمزية
        </h1>
        <p className="text-xs text-neutral-400">
          اختر إحدى الصور الرمزية أدناه
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Name input */}
        <div className="bg-[#121522] border border-neutral-800 rounded-2xl p-5 space-y-2">
          <label className="block text-xs font-bold text-neutral-300">
            اسم المستخدم:
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="اكتب اسمك الجديد"
              className="w-full px-4 py-2.5 bg-[#181d2e] border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* 4x4 Pure Anime Avatar Grid matching WitAnime */}
        <div className="bg-[#121522] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 max-w-md mx-auto">
            {AVATAR_OPTIONS.map((item) => {
              const isSelected = selectedAvatar === item.url;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAvatar(item.url)}
                  className={`group relative aspect-square rounded-full overflow-hidden border-2 transition-all transform hover:scale-110 focus:outline-none ${
                    isSelected
                      ? "border-white ring-4 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-105"
                      : "border-neutral-700/80 hover:border-white/60 hover:shadow-lg"
                  }`}
                  title={item.name}
                >
                  <Image
                    src={item.url}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover brightness-110 contrast-105 transition-all group-hover:brightness-125 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs py-3 rounded-xl text-center font-bold">
            تم حفظ الصورة الرمزية واسم المستخدم بنجاح!
          </div>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <span>حفظ التغييرات</span>
          )}
        </button>
      </form>
    </div>
  );
}
