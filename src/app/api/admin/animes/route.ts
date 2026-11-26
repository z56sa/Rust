import { NextResponse } from "next/server";
import { db } from "@/db";
import { animes, episodes, episodeServers, downloadLinks } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/admin/animes - Fetch all animes with basic info
export async function GET() {
  try {
    const list = await db.select().from(animes).orderBy(desc(animes.createdAt));
    return NextResponse.json({ success: true, animes: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/animes - Create a new anime
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      japaneseTitle,
      synopsis,
      poster,
      banner,
      rating,
      genres,
      status,
      type,
      season,
      releaseYear,
      totalEpisodes,
      studio,
    } = body;

    if (!title || !slug || !poster || !banner) {
      return NextResponse.json(
        { success: false, error: "العنوان، الرابط التعريفي (Slug)، البوستر والبنر حقول مطلوبة" },
        { status: 400 }
      );
    }

    const newAnimeId = `anime_${Date.now()}`;
    const genresArray = Array.isArray(genres)
      ? genres
      : typeof genres === "string"
      ? genres.split(",").map((g: string) => g.trim())
      : [];

    await db.insert(animes).values({
      id: newAnimeId,
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title,
      japaneseTitle: japaneseTitle || null,
      synopsis: synopsis || null,
      poster,
      banner,
      rating: parseFloat(rating) || 0,
      genres: JSON.stringify(genresArray),
      status: status || "مستمر",
      type: type || "TV",
      season: season || null,
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : new Date().getFullYear(),
      totalEpisodes: totalEpisodes || "?",
      studio: studio || null,
      views: 0,
    });

    return NextResponse.json({ success: true, id: newAnimeId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
