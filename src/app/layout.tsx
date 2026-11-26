import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/components/LayoutElements";

export const metadata: Metadata = {
  title: "انمي راست | AnimeRust - منصة الأنمي",
  description: "مرحباً بكم في انمي راست (AnimeRust) - استكشف وتابع محتوى الأنمي بسهولة وسرعة عبر منصة انمي راست.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "JyC248VB5gSvCYFfiXT5wJW_ZnDMnm9B3HovB7fzBm8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta name="google-site-verification" content="JyC248VB5gSvCYFfiXT5wJW_ZnDMnm9B3HovB7fzBm8" />
      </head>
      <body className="bg-[#0b0c13] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-1 w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
