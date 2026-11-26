import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "ar,en;q=0.9",
};

// Extracts real streaming servers and download links from WitAnime or direct anime pages
async function extractServersFromUrl(url: string) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return { servers: [], downloads: [] };
    const html = await res.text();

    const servers: Array<{ name: string; url: string; quality: string }> = [];
    const downloads: Array<{ name: string; url: string; quality: string }> = [];

    // 1. Search for iframe stream embeds (Vidmoly, OK.ru, Streamtape, Dood, Mega, etc)
    const iframeMatches = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)];
    for (const match of iframeMatches) {
      let src = match[1];
      if (src.startsWith("//")) src = "https:" + src;
      if (!src.includes("google") && !src.includes("facebook") && !src.includes("twitter") && !src.includes("disqus")) {
        let name = "Risto Player HD";
        if (src.includes("vidmoly")) name = "Vidmoly HD";
        else if (src.includes("ok.ru")) name = "OK.ru Player";
        else if (src.includes("streamtape")) name = "Streamtape";
        else if (src.includes("uqload")) name = "Uqload Fast";
        else if (src.includes("dood")) name = "DoodStream";
        else if (src.includes("mega")) name = "Mega Cloud";

        servers.push({
          name,
          url: src,
          quality: "1080p",
        });
      }
    }

    // 2. Search for WitAnime stream servers buttons/tabs
    const serverBtnMatches = [...html.matchAll(/data-url=["']([^"']+)["'][^>]*data-server=["']?([^"'>\s]+)?/gi)];
    for (const m of serverBtnMatches) {
      const sUrl = m[1];
      const sName = m[2] || "سيرفر مشاهدة";
      if (sUrl && sUrl.startsWith("http")) {
        servers.push({
          name: sName,
          url: sUrl,
          quality: "1080p",
        });
      }
    }

    // 3. Search for Direct Downloads (Mega, Google Drive, Mediafire, etc)
    const downloadMatches = [...html.matchAll(/href=["'](https?:\/\/(?:mega\.nz|drive\.google\.com|mediafire\.com|1fichier\.com)[^"']+)["']/gi)];
    for (const dm of downloadMatches) {
      const dUrl = dm[1];
      let dName = "تحميل مباشر 1080p";
      if (dUrl.includes("mega.nz")) dName = "Mega.nz 1080p";
      else if (dUrl.includes("drive.google")) dName = "Google Drive 1080p";
      else if (dUrl.includes("mediafire")) dName = "MediaFire 720p";

      downloads.push({
        name: dName,
        url: dUrl,
        quality: "1080p",
      });
    }

    return { servers, downloads };
  } catch (e) {
    return { servers: [], downloads: [] };
  }
}

// POST /api/admin/scraper - Automatically fetch and sync real episodes for any anime
export async function POST(req: Request) {
  try {
    const { animeId, sourceUrl, startEp = 1, endEp = 100 } = await req.json();

    if (!animeId) {
      return NextResponse.json({ success: false, error: "معرف الأنمي animeId مطلوب" }, { status: 400 });
    }

    // 1. Get Anime Info from DB
    const animeRes = await client.execute({
      sql: "SELECT id, slug, title, poster FROM animes WHERE id = ? OR slug = ?",
      args: [animeId, animeId],
    });

    if (animeRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: "الأنمي غير موجود في قاعدة البيانات" }, { status: 404 });
    }

    const anime = animeRes.rows[0];
    const extractedList: any[] = [];

    // If sourceUrl provided (e.g. from WitAnime, Anime4up, etc)
    if (sourceUrl && sourceUrl.startsWith("http")) {
      const res = await fetch(sourceUrl, { headers: HEADERS });
      if (res.ok) {
        const html = await res.text();
        // Match all episode page links
        const epLinks = [...html.matchAll(/href=["']([^"']*(?:episode|حلقة)[^"']*)["']/gi)]
          .map(m => m[1])
          .filter(u => u.startsWith("http"));

        const uniqueLinks = Array.from(new Set(epLinks));

        for (let i = 0; i < uniqueLinks.length && i < endEp; i++) {
          const epUrl = uniqueLinks[i];
          const epNumMatch = epUrl.match(/[-_](\d+)(?:-[^/]+)?\/?$/) || epUrl.match(/episode[-_](\d+)/i) || epUrl.match(/الحلقة[-_ ]+(\d+)/);
          const epNum = epNumMatch ? parseFloat(epNumMatch[1]) : i + 1;

          if (epNum < startEp || epNum > endEp) continue;

          const { servers, downloads } = await extractServersFromUrl(epUrl);
          const episodeId = `${anime.id}_ep_${epNum}`;

          // Insert or Replace Episode
          await client.execute({
            sql: `INSERT OR REPLACE INTO episodes (id, anime_id, number, title, thumbnail, duration, release_date)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
              episodeId,
              anime.id,
              epNum,
              `الحلقة ${epNum}`,
              anime.poster,
              "24 دقيقة",
              new Date().toISOString().split("T")[0],
            ],
          });

          // Insert servers if any found
          for (let sIdx = 0; sIdx < servers.length; sIdx++) {
            const s = servers[sIdx];
            await client.execute({
              sql: `INSERT OR REPLACE INTO episode_servers (id, episode_id, name, url, quality)
                    VALUES (?, ?, ?, ?, ?)`,
              args: [`srv_${Date.now()}_${sIdx}`, episodeId, s.name, s.url, s.quality],
            });
          }

          extractedList.push({
            episode: epNum,
            serversCount: servers.length,
            downloadsCount: downloads.length,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      anime: anime.title,
      totalEpisodesSynced: extractedList.length,
      episodes: extractedList,
      message: `تم جلب ومزامنة ${extractedList.length} حلقة حقيقية مع السيرفرات بنجاح!`,
    });
  } catch (error: any) {
    console.error("Scraper API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
