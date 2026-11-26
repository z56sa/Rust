"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      // If admin, can go to admin or home
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between items-center py-10 px-4 text-white">
      <div className="w-full max-w-[420px] flex flex-col items-center mt-6">
        {/* Logo Badge */}
        <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg shadow-white/5">
          R
        </div>

        {/* Title & Subtitle matching image */}
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
          مرحبًا بعودتك
        </h1>
        <p className="text-xs text-neutral-400 mb-8">
          سجّل الدخول إلى حسابك على RustAnime
        </p>

        {/* Error message */}
        {error && (
          <div className="w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs py-2.5 px-4 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300 text-right">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-2.5 bg-[#141414] border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
              dir="ltr"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300 text-right">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#141414] border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors pl-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              href="/forgot-password"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              هل نسيت كلمة المرور؟
            </Link>

            <label className="flex items-center gap-2 cursor-pointer text-neutral-300 select-none">
              <span>تذكّرني</span>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141414] border-neutral-700 text-white focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 bg-white hover:bg-neutral-200 text-black font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-xs text-neutral-400">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-white font-bold hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>

      {/* Footer Info matching WitAnime style */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-xs text-neutral-500 mt-16 pt-8 border-t border-neutral-900">
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="hover:text-neutral-400 transition-colors">اتصل بنا</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">شروط الاستخدام</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">سياسة الخصوصية</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">حقوق الملكية (DMCA)</Link>
        </div>

        <div className="flex items-center gap-1.5 text-neutral-400">
          <span>RustAnime</span>
          <div className="w-4 h-4 bg-white text-black text-[10px] font-black rounded flex items-center justify-center">
            R
          </div>
        </div>
        <p className="text-[11px] text-neutral-600">
          جميع الحقوق محفوظة © 2026 RustAnime
        </p>
      </div>
    </div>
  );
}
