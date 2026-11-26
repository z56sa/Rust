import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

const client = createClient({
  url,
  authToken,
});

async function getSessionUserId() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        if (session.id) return session.id;
      } catch (e) {}
    }
  } catch (e) {}
  
  // Default to primary admin user
  return "admin_user_01";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const animeId = searchParams.get("animeId");
    const userId = await getSessionUserId();

    if (animeId) {
      const records = await client.execute({
        sql: "SELECT * FROM user_lists WHERE user_id = ? AND anime_id = ?",
        args: [userId, animeId],
      });

      const rows = records.rows as any[];
      const statusItem = rows.find((r) => r.status !== "favorite");
      const isFav = rows.some((r) => r.status === "favorite");

      return NextResponse.json({
        status: statusItem?.status || null,
        isFavorite: isFav,
      });
    }

    // Join with animes to return full anime info for /profile/lists
    const joined = await client.execute({
      sql: `
        SELECT 
          ul.id as list_id,
          ul.user_id,
          ul.anime_id,
          ul.status,
          ul.created_at as list_created_at,
          a.id as a_id,
          a.slug as a_slug,
          a.title as a_title,
          a.poster as a_poster,
          a.rating as a_rating,
          a.release_year as a_release_year,
          a.type as a_type
        FROM user_lists ul
        INNER JOIN animes a ON ul.anime_id = a.id
        WHERE ul.user_id = ?
        ORDER BY ul.created_at DESC
      `,
      args: [userId],
    });

    const listWithAnime = joined.rows.map((row: any) => ({
      id: row.list_id,
      userId: row.user_id,
      animeId: row.anime_id,
      status: row.status,
      createdAt: row.list_created_at,
      anime: {
        id: row.a_id,
        slug: row.a_slug,
        title: row.a_title,
        poster: row.a_poster,
        rating: row.a_rating,
        releaseYear: row.a_release_year,
        type: row.a_type,
      },
    }));

    return NextResponse.json({ list: listWithAnime });
  } catch (error: any) {
    console.error("List GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    const body = await req.json();
    const { animeId, status, isFavoriteToggle } = body;

    if (!animeId) {
      return NextResponse.json({ error: "animeId مطلوب" }, { status: 400 });
    }

    if (isFavoriteToggle) {
      const existingFav = await client.execute({
        sql: "SELECT id FROM user_lists WHERE user_id = ? AND anime_id = ? AND status = 'favorite'",
        args: [userId, animeId],
      });

      if (existingFav.rows.length > 0) {
        await client.execute({
          sql: "DELETE FROM user_lists WHERE user_id = ? AND anime_id = ? AND status = 'favorite'",
          args: [userId, animeId],
        });
        return NextResponse.json({ success: true, isFavorite: false });
      } else {
        const id = `fav_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await client.execute({
          sql: "INSERT INTO user_lists (id, user_id, anime_id, status) VALUES (?, ?, ?, 'favorite')",
          args: [id, userId, animeId],
        });
        return NextResponse.json({ success: true, isFavorite: true });
      }
    }

    if (status) {
      // Remove other watch statuses (watching, plan, completed) for this anime
      await client.execute({
        sql: "DELETE FROM user_lists WHERE user_id = ? AND anime_id = ? AND status != 'favorite'",
        args: [userId, animeId],
      });

      if (status !== "none" && status !== "remove") {
        const id = `list_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await client.execute({
          sql: "INSERT INTO user_lists (id, user_id, anime_id, status) VALUES (?, ?, ?, ?)",
          args: [id, userId, animeId, status],
        });
      }

      return NextResponse.json({ success: true, status: status === "none" || status === "remove" ? null : status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("List POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
