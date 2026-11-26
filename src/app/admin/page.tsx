"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlusCircle, Film, Tv, Video, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert, Sparkles, DownloadCloud, Play } from "lucide-react";

interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  poster: string;
  rating: number;
  status: string;
  type: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"animes" | "add-anime" | "add-episode" | "auto-scraper">("animes");
  const [scraperForm, setScraperForm] = useState({
    animeId: "",
    sourceUrl: "",
    startEp: 1,
    endEp: 24,
  });
  const [scraping, setScraping] = useState(false);
  const [animesList, setAnimesList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/user_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed.email === "hi423179@gmail.com" || parsed.role === "admin") {
          setIsAdmin(true);
          return;
        }
      } catch (e) {}
    }
    setIsAdmin(false);
  }, []);

  // Form: New Anime
  const [animeForm, setAnimeForm] = useState({
    title: "",
    slug: "",
    japaneseTitle: "",
    synopsis: "",
    poster: "",
    banner: "",
    rating: "8.5",
    genres: "أكشن, مغامرات, خارق للطبيعة",
    status: "مستمر",
    type: "TV",
    season: "خريف 2024",
    releaseYear: "2024",
    totalEpisodes: "12",
    studio: "MAPPA",
  });

  // Form: New Episode
  const [episodeForm, setEpisodeForm] = useState({
    animeId: "",
    number: "1",
    title: "بداية الرحلة",
    thumbnail: "",
    duration: "24 دقيقة",
    servers: [
      { name: "Risto Cloud HD", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "1080p" },
      { name: "Vidmoly", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", quality: "720p" },
    ],
    downloads: [
      { name: "Mega.nz (1080p)", url: "https://mega.nz", quality: "1080p" },
    ],
  });

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/animes");
      const data = await res.json();
      if (data.success) {
        setAnimesList(data.animes);
        if (data.animes.length > 0 && !episodeForm.animeId) {
          setEpisodeForm((prev) => ({ ...prev, animeId: data.animes[0].id }));
        }
      }
    } catch {
      setMsg({ type: "error", text: "تعذر جلب الأنميات من قاعدة بيانات Turso" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  // Submit Anime
  const handleCreateAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/animes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(animeForm),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "تمت إضافة الأنمي بنجاح إلى قاعدة بيانات Turso!" });
        fetchAnimes();
        setActiveTab("animes");
      } else {
        setMsg({ type: "error", text: data.error || "حدث خطأ أثناء الإضافة" });
      }
    } catch {
      setMsg({ type: "error", text: "خطأ في الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  // Submit Episode
  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(episodeForm),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: `تم رفع الحلقة ${episodeForm.number} وسيرفرات البث بنجاح إلى Turso!` });
        setEpisodeForm((prev) => ({
          ...prev,
          number: (parseInt(prev.number, 10) + 1).toString(),
        }));
      } else {
        setMsg({ type: "error", text: data.error || "فشل إضافة الحلقة" });
      }
    } catch {
      setMsg({ type: "error", text: "خطأ أثناء إرسال البيانات" });
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">غير مصرح بالدخول</h1>
        <p className="text-xs text-neutral-400 max-w-md">
          لوحة الإدارة مخصصة فقط للمالك والمسؤول الرئيسي (<span className="text-white font-mono">hi423179@gmail.com</span>).
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Admin Header */}
      <div className="bg-[#121522] border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            لوحة تحكم رست أنمي (Rust Anime Admin Panel)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            إدارة الأنميات، الحلقات، وسيرفرات البث مباشرة على قاعدة بيانات <span className="text-cyan-400 font-mono font-bold">Turso Cloud</span>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveTab("animes"); setMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "animes" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-[#181d2e] text-gray-300 hover:bg-gray-800"
            }`}
          >
            الأنميات الحالية
          </button>
          <button
            onClick={() => { setActiveTab("add-anime"); setMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "add-anime" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-[#181d2e] text-gray-300 hover:bg-gray-800"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            إضافة أنمي جديد
          </button>
          <button
            onClick={() => { setActiveTab("add-episode"); setMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "add-episode" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-[#181d2e] text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Video className="w-4 h-4" />
            إضافة حلقة يدوياً
          </button>
          <button
            onClick={() => { setActiveTab("auto-scraper"); setMsg(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "auto-scraper" ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-[#181d2e] text-amber-400 hover:bg-gray-800 border border-amber-500/30"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            جالب الحلقات التلقائي (REA Tool)
          </button>
        </div>
      </div>

      {/* Notifications */}
      {msg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 text-sm ${
            msg.type === "success"
              ? "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
              : "bg-rose-950/60 border-rose-600/50 text-rose-300"
          }`}
        >
          {msg.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {msg.text}
        </div>
      )}

      {/* TAB 1: Animes List */}
      {activeTab === "animes" && (
        <div className="bg-[#121522] border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              الأنميات المحفوظة في Turso Cloud ({animesList.length})
            </h2>
            <button
              onClick={fetchAnimes}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-gray-800/60 px-3 py-1.5 rounded-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              تحديث
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {animesList.map((a) => (
              <div key={a.id} className="bg-[#171b2b] border border-gray-800 p-3 rounded-xl flex gap-3 items-center">
                <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  <Image src={a.poster} alt={a.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs text-white truncate">{a.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                    <span className="text-white">★ {a.rating}</span>
                    <span>•</span>
                    <span>{a.status}</span>
                    <span>•</span>
                    <span className="text-rose-400">{a.type}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono block mt-1">/{a.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Add New Anime Form */}
      {activeTab === "add-anime" && (
        <form onSubmit={handleCreateAnime} className="bg-[#121522] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Tv className="w-5 h-5 text-rose-500" />
            بيانات الأنمي الجديد
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">اسم الأنمي بالعربي *</label>
              <input
                type="text"
                required
                value={animeForm.title}
                onChange={(e) => setAnimeForm({ ...animeForm, title: e.target.value })}
                placeholder="مثال: هجوم العمالقة"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">الرابط المخصص (Slug) بالإنجليزية *</label>
              <input
                type="text"
                required
                value={animeForm.slug}
                onChange={(e) => setAnimeForm({ ...animeForm, slug: e.target.value })}
                placeholder="attack-on-titan"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">الاسم بالياباني أو الإنجليزي</label>
              <input
                type="text"
                value={animeForm.japaneseTitle}
                onChange={(e) => setAnimeForm({ ...animeForm, japaneseTitle: e.target.value })}
                placeholder="Shingeki no Kyojin"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">الاستوديو</label>
              <input
                type="text"
                value={animeForm.studio}
                onChange={(e) => setAnimeForm({ ...animeForm, studio: e.target.value })}
                placeholder="WIT Studio / MAPPA"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-300 mb-1">قصة الأنمي (Synopsis)</label>
              <textarea
                rows={3}
                value={animeForm.synopsis}
                onChange={(e) => setAnimeForm({ ...animeForm, synopsis: e.target.value })}
                placeholder="اكتب نبذة عن قصة الأنمي هنا..."
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">رابط صورة البوستر (Poster URL) *</label>
              <input
                type="url"
                required
                value={animeForm.poster}
                onChange={(e) => setAnimeForm({ ...animeForm, poster: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">رابط صورة البنر العريض (Banner URL) *</label>
              <input
                type="url"
                required
                value={animeForm.banner}
                onChange={(e) => setAnimeForm({ ...animeForm, banner: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">التصنيفات (مفصولة بفاصلة)</label>
              <input
                type="text"
                value={animeForm.genres}
                onChange={(e) => setAnimeForm({ ...animeForm, genres: e.target.value })}
                placeholder="أكشن, شونين, دراما"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 mb-1">الحالة</label>
                <select
                  value={animeForm.status}
                  onChange={(e) => setAnimeForm({ ...animeForm, status: e.target.value })}
                  className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
                >
                  <option value="مستمر">مستمر</option>
                  <option value="مكتمل">مكتمل</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">التقييم</label>
                <input
                  type="number"
                  step="0.1"
                  value={animeForm.rating}
                  onChange={(e) => setAnimeForm({ ...animeForm, rating: e.target.value })}
                  className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/30 text-sm"
          >
            {loading ? "جاري الحفظ في Turso..." : "حفظ الأنمي في قاعدة البيانات"}
          </button>
        </form>
      )}

      {/* TAB 3: Add Episode & Stream Servers */}
      {activeTab === "add-episode" && (
        <form onSubmit={handleCreateEpisode} className="bg-[#121522] border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-500" />
            إضافة حلقة جديدة وسيرفرات المشاهدة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 mb-1">اختر الأنمي *</label>
              <select
                value={episodeForm.animeId}
                onChange={(e) => setEpisodeForm({ ...episodeForm, animeId: e.target.value })}
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              >
                {animesList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">رقم الحلقة *</label>
              <input
                type="number"
                required
                value={episodeForm.number}
                onChange={(e) => setEpisodeForm({ ...episodeForm, number: e.target.value })}
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">عنوان الحلقة</label>
              <input
                type="text"
                value={episodeForm.title}
                onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                placeholder="عنوان الحلقة (اختياري)"
                className="w-full bg-[#181d2e] border border-gray-700/70 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          {/* Servers list */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-gray-200">سيرفرات المشاهدة (Embed Players):</h3>
            {episodeForm.servers.map((srv, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#181d2e] p-3 rounded-lg border border-gray-700/50 text-xs">
                <input
                  type="text"
                  placeholder="اسم السيرفر (مثال: Vidmoly / Risto Server)"
                  value={srv.name}
                  onChange={(e) => {
                    const next = [...episodeForm.servers];
                    next[idx].name = e.target.value;
                    setEpisodeForm({ ...episodeForm, servers: next });
                  }}
                  className="bg-[#121522] border border-gray-700 rounded p-2 text-white"
                />
                <input
                  type="url"
                  placeholder="رابط التضمين (Embed URL)"
                  value={srv.url}
                  onChange={(e) => {
                    const next = [...episodeForm.servers];
                    next[idx].url = e.target.value;
                    setEpisodeForm({ ...episodeForm, servers: next });
                  }}
                  className="bg-[#121522] border border-gray-700 rounded p-2 text-white font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="الجودة (1080p, 720p...)"
                  value={srv.quality}
                  onChange={(e) => {
                    const next = [...episodeForm.servers];
                    next[idx].quality = e.target.value;
                    setEpisodeForm({ ...episodeForm, servers: next });
                  }}
                  className="bg-[#121522] border border-gray-700 rounded p-2 text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/30 text-sm"
          >
            {loading ? "جاري الإضافة إلى Turso..." : "إضافة الحلقة وسيرفرات البث"}
          </button>
        </form>
      )}

      {/* TAB 4: REA Auto Scraper Tool */}
      {activeTab === "auto-scraper" && (
        <div className="bg-[#121522] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                أداة جلب واستخراج الحلقات الحقيقية التلقائية (REA Auto-Extractor)
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                ضع رابط صفحة الأنمي من موقع المشاهدة (مثل WitAnime أو Anime4up) وستقوم الأداة بفحص واستخراج كل الحلقات، وسيرفرات البث الحقيقية وروابط التحميل ورفعها مباشرة إلى قاعدة بيانات Turso بدون أي تدخل يدوي!
              </p>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setScraping(true);
              setMsg(null);
              try {
                const res = await fetch("/api/admin/scraper", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(scraperForm),
                });
                const data = await res.json();
                if (data.success) {
                  setMsg({ type: "success", text: data.message });
                } else {
                  setMsg({ type: "error", text: data.error || "فشل الجلب التلقائي" });
                }
              } catch {
                setMsg({ type: "error", text: "حدث خطأ أثناء الاتصال بالأداة" });
              } finally {
                setScraping(false);
              }
            }}
            className="space-y-4 max-w-2xl"
          >
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                اختر الأنمي المستهدف في موقعك:
              </label>
              <select
                value={scraperForm.animeId}
                onChange={(e) => setScraperForm({ ...scraperForm, animeId: e.target.value })}
                required
                className="w-full bg-[#181d2e] border border-gray-700 rounded-xl p-3 text-white text-xs"
              >
                <option value="">-- اختر الأنمي --</option>
                {animesList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                رابط المصدر الحقيقي للأنمي (WitAnime / Anime4up):
              </label>
              <input
                type="url"
                required
                placeholder="https://witanime.site/anime/solo-leveling-season-2/"
                value={scraperForm.sourceUrl}
                onChange={(e) => setScraperForm({ ...scraperForm, sourceUrl: e.target.value })}
                className="w-full bg-[#181d2e] border border-gray-700 rounded-xl p-3 text-white text-xs font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                تقوم الأداة بزيارة الرابط واستخراج جميع الحلقات تلقائياً من 1 إلى آخر حلقة.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">من الحلقة رقم:</label>
                <input
                  type="number"
                  min="1"
                  value={scraperForm.startEp}
                  onChange={(e) => setScraperForm({ ...scraperForm, startEp: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#181d2e] border border-gray-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">إلى الحلقة رقم:</label>
                <input
                  type="number"
                  min="1"
                  value={scraperForm.endEp}
                  onChange={(e) => setScraperForm({ ...scraperForm, endEp: parseInt(e.target.value) || 12 })}
                  className="w-full bg-[#181d2e] border border-gray-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={scraping}
              className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {scraping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري استخراج الحلقات والسيرفرات الحقيقية ورفعها إلى Turso...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>بدء الاستخراج والمزامنة التلقائية الآن</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
