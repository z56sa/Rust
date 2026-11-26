import { NextRequest, NextResponse } from "next/server";

// Curated overrides for famous long-running franchises to ensure the beginning/season 1/East Blue trailer plays
const CURATED_TRAILERS: Record<string, string> = {
  // One Piece: Official trailer requested by user (Z9SRuSpwq5w)
  "one piece": "https://www.youtube.com/embed/Z9SRuSpwq5w?autoplay=1&enablejsapi=1",
  "one-piece": "https://www.youtube.com/embed/Z9SRuSpwq5w?autoplay=1&enablejsapi=1",
  "ون بيس": "https://www.youtube.com/embed/Z9SRuSpwq5w?autoplay=1&enablejsapi=1",
  // Naruto: Official Beginning Trailer
  "naruto": "https://www.youtube.com/embed/j2hiC9Gm4F4?autoplay=1&enablejsapi=1",
  "ناروتو": "https://www.youtube.com/embed/j2hiC9Gm4F4?autoplay=1&enablejsapi=1",
  // Bleach: Official Beginning Trailer
  "bleach": "https://www.youtube.com/embed/oZ67d9f7N34?autoplay=1&enablejsapi=1",
  "بليتش": "https://www.youtube.com/embed/oZ67d9f7N34?autoplay=1&enablejsapi=1",
  // Attack on Titan: Season 1 Official Trailer
  "attack on titan": "https://www.youtube.com/embed/MGRm4IzK1SQ?autoplay=1&enablejsapi=1",
  "shingeki no kyojin": "https://www.youtube.com/embed/MGRm4IzK1SQ?autoplay=1&enablejsapi=1",
  "هجوم العمالقة": "https://www.youtube.com/embed/MGRm4IzK1SQ?autoplay=1&enablejsapi=1",
  // Hunter x Hunter: 2011 Official Trailer
  "hunter x hunter": "https://www.youtube.com/embed/d6kBeJjTGnY?autoplay=1&enablejsapi=1",
  "هنتر x هنتر": "https://www.youtube.com/embed/d6kBeJjTGnY?autoplay=1&enablejsapi=1",
  "القناص": "https://www.youtube.com/embed/d6kBeJjTGnY?autoplay=1&enablejsapi=1",
  // Death Note: Official Trailer
  "death note": "https://www.youtube.com/embed/NlJZ-YgAt-c?autoplay=1&enablejsapi=1",
  "مذكرة الموت": "https://www.youtube.com/embed/NlJZ-YgAt-c?autoplay=1&enablejsapi=1",
};

// In-memory cache for dynamic trailer embeds
const trailerCache = new Map<string, string>();

// Words that indicate non-anime live-action versions
const EXCLUDE_WORDS = [
  "live action",
  "live-action",
  "netflix live",
  "inaki godoy",
  "mackenyu",
  "emily rudd",
  "official trailer | netflix",
  "teaser | netflix",
  "stage play",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const title = searchParams.get("title") || q;

  if (!title) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const normalized = title.toLowerCase().trim();

  // 1. Check curated overrides first
  for (const [key, embedUrl] of Object.entries(CURATED_TRAILERS)) {
    if (normalized === key || normalized.includes(key)) {
      return NextResponse.json({ embedUrl });
    }
  }

  // 2. Check in-memory cache
  if (trailerCache.has(normalized)) {
    return NextResponse.json({ embedUrl: trailerCache.get(normalized) });
  }

  try {
    let cleanTitle = title;
    const bracketMatch = title.match(/\(([^)]+)\)/);
    if (bracketMatch && bracketMatch[1].length > 2) {
      cleanTitle = bracketMatch[1];
    } else {
      cleanTitle = title.replace(/[()]/g, " ").trim();
    }

    const searchQuery = `${cleanTitle} Season 1 anime official trailer Toei Crunchyroll Animation`;
    const ytRes = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(6000),
      }
    );

    if (ytRes.ok) {
      const html = await ytRes.text();

      // Approach 1: Check lockupViewModel items
      const lockupRegex =
        /"lockupViewModel":\{"contentImage":[\s\S]*?"videoId":"([a-zA-Z0-9_-]{11})"[\s\S]*?"metadata":\{"lockupMetadataViewModel":\{"title":\{"content":"([^"]+)"/g;
      let m;
      const candidates: { id: string; title: string }[] = [];
      while ((m = lockupRegex.exec(html)) !== null) {
        candidates.push({ id: m[1], title: m[2] });
      }

      // Filter out live-action / Netflix real-life trailers
      const filtered = candidates.filter((c) => {
        const lower = c.title.toLowerCase();
        return !EXCLUDE_WORDS.some((w) => lower.includes(w));
      });

      if (filtered.length > 0) {
        const embedUrl = `https://www.youtube.com/embed/${filtered[0].id}?autoplay=1&enablejsapi=1`;
        trailerCache.set(normalized, embedUrl);
        return NextResponse.json({ embedUrl });
      }

      // Approach 2: If lockup didn't match, extract videoId directly but skip known live-action IDs
      const rawMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((match) => match[1]);
      const uniqueIds = [...new Set(rawMatches)];
      const nonLiveAction = uniqueIds.filter(
        (id) => id !== "Ades3pQbeh8" && id !== "S-XxKVxZ2fU" && id !== "6gnH4Q_wBMw"
      );
      if (nonLiveAction.length > 0) {
        const embedUrl = `https://www.youtube.com/embed/${nonLiveAction[0]}?autoplay=1&enablejsapi=1`;
        trailerCache.set(normalized, embedUrl);
        return NextResponse.json({ embedUrl });
      }
    }
  } catch (err: any) {
    console.error("Trailer search error:", err?.message);
  }

  // Fallback
  const fallbackUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    title + " anime official trailer"
  )}&autoplay=1`;
  return NextResponse.json({ embedUrl: fallbackUrl });
}
