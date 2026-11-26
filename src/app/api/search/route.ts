import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { animes } from "@/db/schema";
import { like, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const list = await db
      .select({
        id: animes.id,
        slug: animes.slug,
        title: animes.title,
        japaneseTitle: animes.japaneseTitle,
        poster: animes.poster,
        rating: animes.rating,
        status: animes.status,
        type: animes.type,
        releaseYear: animes.releaseYear
      })
      .from(animes)
      .where(
        or(
          like(animes.title, `%${q}%`),
          like(animes.slug, `%${q}%`),
          like(animes.japaneseTitle, `%${q}%`)
        )
      )
      .limit(10);

    return NextResponse.json({ results: list });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message }, { status: 500 });
  }
}
