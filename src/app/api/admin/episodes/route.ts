import { NextResponse } from "next/server";
import { db } from "@/db";
import { episodes, episodeServers, downloadLinks } from "@/db/schema";

// POST /api/admin/episodes - Add an episode with multiple stream servers and download links
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      animeId,
      number,
      title,
      thumbnail,
      duration,
      servers, // array of { name, url, quality }
      downloads, // array of { name, url, quality }
    } = body;

    if (!animeId || number === undefined || !title) {
      return NextResponse.json(
        { success: false, error: "معرف الأنمي ورقم الحلقة وعنوانها مطلوب" },
        { status: 400 }
      );
    }

    const episodeId = `ep_${Date.now()}`;

    // 1. Insert Episode
    await db.insert(episodes).values({
      id: episodeId,
      animeId,
      number: parseInt(number, 10),
      title,
      thumbnail: thumbnail || null,
      duration: duration || "24 دقيقة",
      releaseDate: new Date().toISOString().split("T")[0],
    });

    // 2. Insert Streaming Servers
    if (Array.isArray(servers) && servers.length > 0) {
      for (let i = 0; i < servers.length; i++) {
        const s = servers[i];
        if (s.name && s.url) {
          await db.insert(episodeServers).values({
            id: `srv_${Date.now()}_${i}`,
            episodeId,
            name: s.name,
            url: s.url,
            quality: s.quality || "1080p",
          });
        }
      }
    }

    // 3. Insert Download Links
    if (Array.isArray(downloads) && downloads.length > 0) {
      for (let i = 0; i < downloads.length; i++) {
        const d = downloads[i];
        if (d.name && d.url) {
          await db.insert(downloadLinks).values({
            id: `dl_${Date.now()}_${i}`,
            episodeId,
            name: d.name,
            url: d.url,
            quality: d.quality || "1080p",
          });
        }
      }
    }

    return NextResponse.json({ success: true, episodeId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
