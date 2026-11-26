"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Film } from "lucide-react";

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/user_session=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed.email === "hi423179@gmail.com" || parsed.role === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 font-bold"
    >
      <Film className="w-4 h-4 text-rose-400" />
      <span>لوحة الإدارة (Admin)</span>
    </Link>
  );
}
