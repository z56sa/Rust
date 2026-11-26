import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage = 1, totalPages = 115, basePath }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-8" dir="rtl">
      {/* السابق */}
      <Link
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
          currentPage === 1
            ? "bg-zinc-900 text-zinc-600 pointer-events-none border border-zinc-800/50"
            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
        }`}
      >
        <ChevronRight className="w-3.5 h-3.5" />
        السابق
      </Link>

      {/* صفحة 1 */}
      <Link
        href={`${basePath}?page=1`}
        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition border ${
          currentPage === 1
            ? "bg-white text-black border-white shadow-md"
            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
        }`}
      >
        1
      </Link>

      {/* صفحة 2 */}
      {totalPages >= 2 && (
        <Link
          href={`${basePath}?page=2`}
          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition border ${
            currentPage === 2
              ? "bg-white text-black border-white shadow-md"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
          }`}
        >
          2
        </Link>
      )}

      {/* نقاط الفاصل ... */}
      <span className="w-8 h-8 flex items-center justify-center text-zinc-500 text-xs font-mono">
        ...
      </span>

      {/* آخر صفحة 115 */}
      <Link
        href={`${basePath}?page=${totalPages}`}
        className={`px-2.5 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition border ${
          currentPage === totalPages
            ? "bg-white text-black border-white shadow-md"
            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
        }`}
      >
        {totalPages}
      </Link>

      {/* التالي */}
      <Link
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
          currentPage === totalPages
            ? "bg-zinc-900 text-zinc-600 pointer-events-none border border-zinc-800/50"
            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
        }`}
      >
        التالي
        <ChevronLeft className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
