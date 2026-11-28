import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import animeMalMap from "@/data/animeMalMap.json";
import animeTmdbMap from "@/data/animeTmdbMap.json";
import animeSlayerMap from "@/data/animeSlayerMap.json";

// In-memory cache for resolved stream URLs
const streamCache = new Map<string, { url: string; time: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Anime Slayer API credentials & constants
const SLAYER_CLIENT_ID = "android-app2";
const SLAYER_CLIENT_SECRET = "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd";
const SLAYER_APK_CERT = "44D8B79265DDBB9C887320F64521A76D72F6D7D4";
const SLAYER_RNC_PASSWORD = Buffer.from("android-app9>E>VBa=X%;[5BX~=Q~K");
const SLAYER_BASE_URL = "https://anslayer.com/anime/public/";

const SLAYER_HEADERS = {
  "Client-Id": SLAYER_CLIENT_ID,
  "Client-Secret": SLAYER_CLIENT_SECRET,
  "Accept": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// Complete Slayer ID Mapping for all 174 animes (Original Japanese Audio + Arabic Hardsubs)
const SLAYER_ANIME_MAP: Record<string, string> = {
  ...(animeSlayerMap as Record<string, string>),
};

function pkcs7Pad(buf: Buffer, blockSize: number): Buffer {
  const padLen = blockSize - (buf.length % blockSize);
  const padBuf = Buffer.alloc(padLen, padLen);
  return Buffer.concat([buf, padBuf]);
}

function pkcs7Unpad(buf: Buffer): Buffer {
  const padLen = buf[buf.length - 1];
  return buf.subarray(0, buf.length - padLen);
}

// Resolve real hardsubbed MP4 video stream from Anime Slayer CDN
async function resolveSlayerStream(slug: string, epNum: number): Promise<string | null> {
  const cacheKey = `slayer_${slug}_${epNum}`;
  const cached = streamCache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    console.log(`[Slayer] Cache HIT for ${slug} ep${epNum}`);
    return cached.url;
  }

  console.log(`[Slayer] Starting resolution: slug=${slug} ep=${epNum}`);

  try {
    let slayerAnimeId = SLAYER_ANIME_MAP[slug];
    console.log(`[Slayer] Direct map lookup: slayerAnimeId=${slayerAnimeId ?? "NOT FOUND"}`);

    if (!slayerAnimeId) {
      // Smart Multi-Strategy Dynamic Search
      const strippedYear = slug.replace(/-(?:19|20)\d{2}.*$/, "");
      const words = strippedYear.split("-").filter((w) => w.length > 1);
      const searchCandidates = [
        slug.replace(/-/g, " "),
        strippedYear.replace(/-/g, " "),
        words.slice(0, 3).join(" "),
        words.slice(0, 2).join(" "),
      ];

      console.log(`[Slayer] Dynamic search candidates:`, searchCandidates);

      for (const cand of searchCandidates) {
        if (!cand || cand.length < 2) continue;
        const searchPayload = JSON.stringify({ list_type: "anime_list", anime_name: cand, limit: 10 });
        const searchRes = await fetch(
          `${SLAYER_BASE_URL}animes/get-published-animes?json=${encodeURIComponent(searchPayload)}`,
          { headers: SLAYER_HEADERS, signal: AbortSignal.timeout(6000) }
        );
        console.log(`[Slayer] Search "${cand}" => status=${searchRes.status}`);
        if (searchRes.ok) {
          const json = await searchRes.json();
          const hits = json.response?.data || [];
          console.log(`[Slayer] Search "${cand}" => hits=${hits.length}`);
          if (hits.length > 0) {
            // Find closest match or first hit
            const match = hits.find(
              (h: any) =>
                h.anime_name.toLowerCase().includes(cand.toLowerCase()) ||
                cand.toLowerCase().includes(h.anime_name.toLowerCase())
            ) || hits[0];
            slayerAnimeId = match.anime_id;
            console.log(`[Slayer] Dynamic match: "${match.anime_name}" => id=${slayerAnimeId}`);
            break;
          }
        }
      }
    }

    if (!slayerAnimeId) {
      console.log(`[Slayer] FAILED: No anime ID found for slug=${slug}`);
      return null;
    }

    // Fetch episodes for this anime
    console.log(`[Slayer] Fetching details for animeId=${slayerAnimeId}...`);
    const detailsRes = await fetch(
      `${SLAYER_BASE_URL}anime/get-anime-details?anime_id=${slayerAnimeId}&fetch_episodes=Yes&more_info=No`,
      { headers: SLAYER_HEADERS, signal: AbortSignal.timeout(8000) }
    );
    console.log(`[Slayer] detailsRes status=${detailsRes.status}`);
    if (!detailsRes.ok) {
      console.log(`[Slayer] FAILED: details fetch not ok`);
      return null;
    }
    const detailsJson = await detailsRes.json();
    const eps = detailsJson.response?.episodes?.data || detailsJson.response?.episodes || [];
    console.log(`[Slayer] Episodes count=${eps.length}`);

    const targetEp = eps.find((e: any) => String(e.episode_number) === String(epNum));
    if (!targetEp) {
      console.log(`[Slayer] FAILED: ep ${epNum} not found in episodes list`);
      return null;
    }
    console.log(`[Slayer] Target ep found: ep_id=${targetEp.episode_id}`);

    const cdnUrl = targetEp.episode_urls?.find((u: any) => u.episode_server_name === "cdn")?.episode_url;
    if (!cdnUrl) {
      console.log(`[Slayer] FAILED: no cdn URL in ep urls:`, JSON.stringify(targetEp.episode_urls?.map((u:any)=>u.episode_server_name)));
      return null;
    }
    console.log(`[Slayer] CDN URL found: ${cdnUrl.substring(0, 80)}...`);

    const parsed = new URL(cdnUrl);
    const fVal = parsed.searchParams.get("f");
    const eVal = parsed.searchParams.get("e");
    if (!fVal || !eVal) {
      console.log(`[Slayer] FAILED: missing f/e params in CDN URL`);
      return null;
    }

    // 1. Fetch dynamic google.php seed
    console.log(`[Slayer] Fetching google.php seed...`);
    const seedRes = await fetch(`${SLAYER_BASE_URL}google.php`, {
      headers: SLAYER_HEADERS,
      signal: AbortSignal.timeout(6000),
    });
    console.log(`[Slayer] google.php status=${seedRes.status}`);
    if (!seedRes.ok) {
      console.log(`[Slayer] FAILED: google.php not ok`);
      return null;
    }
    const seed = (await seedRes.text()).trim();
    console.log(`[Slayer] seed="${seed}" len=${seed.length}`);

    // 2. Derive AES Key
    const keyStr = (seed.slice(0, 10) + SLAYER_APK_CERT.slice(0, 22)).slice(0, 16);
    const keyBytes = Buffer.from(keyStr, "utf-8");
    console.log(`[Slayer] AES key derived (len=${keyStr.length})`);

    // 3. Encrypt compact native payload
    const nativeJson = JSON.stringify({
      uhy: "com.anslayer",
      dma: 47,
      mvd: "1.5.10",
      vko: SLAYER_APK_CERT,
    });
    const padded = pkcs7Pad(Buffer.from(nativeJson, "utf-8"), 16);
    const cipher = crypto.createCipheriv("aes-128-ecb", keyBytes, null);
    cipher.setAutoPadding(false);
    const encrypted = Buffer.concat([cipher.update(padded), cipher.final()]);
    const b64Enc = encrypted.toString("base64");
    const infStr = JSON.stringify({ a: b64Enc, b: seed });

    // 4. POST to v-qs.php
    console.log(`[Slayer] Posting to v-qs.php...`);
    const body = new URLSearchParams({ f: fVal, e: eVal, inf: infStr });
    const vqsRes = await fetch(`${SLAYER_BASE_URL}v-qs.php`, {
      method: "POST",
      headers: { ...SLAYER_HEADERS, "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(8000),
    });

    console.log(`[Slayer] v-qs.php status=${vqsRes.status}`);
    if (!vqsRes.ok) {
      console.log(`[Slayer] FAILED: v-qs.php not ok`);
      return null;
    }
    const rawB64 = (await vqsRes.text()).trim();
    console.log(`[Slayer] rawB64 length=${rawB64.length} preview=${rawB64.substring(0,30)}`);
    if (!rawB64) {
      console.log(`[Slayer] FAILED: empty v-qs response`);
      return null;
    }

    // 5. Decrypt RNCryptor v3 envelope
    const envelope = Buffer.from(rawB64, "base64");
    console.log(`[Slayer] envelope length=${envelope.length}`);
    if (envelope.length <= 66) {
      console.log(`[Slayer] FAILED: envelope too short`);
      return null;
    }

    const encSalt = envelope.subarray(2, 10);
    const iv = envelope.subarray(18, 34);
    const ciphertext = envelope.subarray(34, envelope.length - 32);

    const encKey = crypto.pbkdf2Sync(SLAYER_RNC_PASSWORD, encSalt, 10000, 32, "sha1");
    const decipher = crypto.createDecipheriv("aes-256-cbc", encKey, iv);
    decipher.setAutoPadding(false);
    const decryptedPadded = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const decrypted = pkcs7Unpad(decryptedPadded);
    const streamList = JSON.parse(decrypted.toString("utf-8"));

    console.log(`[Slayer] Decrypted streamList count=${Array.isArray(streamList) ? streamList.length : "NOT ARRAY"}`);

    if (Array.isArray(streamList) && streamList.length > 0) {
      // Pick highest quality (last item or h.mp4)
      const highStream = streamList.find((s: any) => s.file && s.file.includes("/h.mp4")) || streamList[streamList.length - 1];
      if (highStream?.file) {
        console.log(`[Slayer] SUCCESS: stream URL=${highStream.file.substring(0,60)}...`);
        streamCache.set(cacheKey, { url: highStream.file, time: Date.now() });
        return highStream.file;
      }
    }

    console.log(`[Slayer] FAILED: no valid file in streamList`);
  } catch (err: any) {
    console.error(`[Slayer] EXCEPTION slug=${slug} ep=${epNum}:`, err?.message);
  }

  return null;
}

// Fallback: extract direct working video mirror from megamax if available
async function resolveMegamax(hashId: string): Promise<string | null> {
  const cached = streamCache.get(`mega_${hashId}`);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.url;
  }

  try {
    const pageRes = await fetch(`https://megamax.me/iframe/${hashId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(3000),
    });
    const t = await pageRes.text();
    const start = t.indexOf('type="application/json">{');
    if (start === -1) return null;
    const end = t.indexOf('</script>', start);
    const jsonStr = t.substring(start + 'type="application/json">'.length, end);
    const data = JSON.parse(jsonStr);
    const version = data.version;

    const res = await fetch(`https://megamax.me/iframe/${hashId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "X-Inertia": "true",
        "X-Inertia-Version": version,
        "X-Inertia-Partial-Component": "files/mirror/video",
        "X-Inertia-Partial-Data": "streams",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `https://megamax.me/iframe/${hashId}`,
      },
      signal: AbortSignal.timeout(3000),
    });
    const json = await res.json();
    const streams = json.props?.streams?.data;
    if (!streams || !streams.length) return null;

    const mirrors = streams[0].mirrors || [];
    const priority = ["lulustream", "streamhg", "vidmoly", "mp4upload"];
    for (const p of priority) {
      const match = mirrors.find((m: any) => m.driver === p);
      if (match && match.link) {
        let link = match.link;
        if (link.startsWith("//")) link = "https:" + link;
        streamCache.set(`mega_${hashId}`, { url: link, time: Date.now() });
        return link;
      }
    }
  } catch (e: any) {
    console.error("Megamax extract error:", e?.message);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const hash = searchParams.get("hash");
  const slug = searchParams.get("slug") || "";
  const ep = parseInt(searchParams.get("ep") || "1", 10);
  const rawMal = searchParams.get("mal");
  const srv = searchParams.get("srv");

  // Allow checking Slayer debug logs directly via ?debug=1
  const debug = searchParams.get("debug");
  if (debug === "1" && slug) {
    const logs: string[] = [];
    const origLog = console.log;
    const origErr = console.error;
    console.log = (...args) => { logs.push(args.join(" ")); origLog(...args); };
    console.error = (...args) => { logs.push("[ERR] " + args.join(" ")); origErr(...args); };
    try {
      const res = await resolveSlayerStream(slug, ep);
      return NextResponse.json({ success: !!res, result: res, logs });
    } finally {
      console.log = origLog;
      console.error = origErr;
    }
  }

  let streamUrl = "";
  let isDirectVideo = false;

  // If specific server index requested:
  if (srv === "2") {
    // MultiEmbed (Fast, high-uptime multi-source player with Japanese/Arabic/English)
    const tmdbEntry = (animeTmdbMap as Record<string, { tmdb: number; season: number }>)[slug];
    if (tmdbEntry) {
      streamUrl = `https://multiembed.mov/?video_id=${tmdbEntry.tmdb}&tmdb=1&s=${tmdbEntry.season}&e=${ep}`;
    } else {
      let malId: number | undefined = rawMal ? Number(rawMal) : undefined;
      if (!malId && slug) malId = (animeMalMap as Record<string, number>)[slug];
      if (malId) {
        streamUrl = `https://www.2embed.cc/embed/anime/${malId}/${ep}`;
      }
    }
  } else if (srv === "3") {
    // 2Embed / VidSrc alternative
    let malId: number | undefined = rawMal ? Number(rawMal) : undefined;
    if (!malId && slug) malId = (animeMalMap as Record<string, number>)[slug];
    if (malId) {
      streamUrl = `https://www.2embed.cc/embed/anime/${malId}/${ep}`;
    } else {
      const tmdbEntry = (animeTmdbMap as Record<string, { tmdb: number; season: number }>)[slug];
      if (tmdbEntry) {
        streamUrl = `https://multiembed.mov/?video_id=${tmdbEntry.tmdb}&tmdb=1&s=${tmdbEntry.season}&e=${ep}`;
      }
    }
  } else if (srv === "4") {
    // VidSrc.pm — reliable fallback with high uptime
    const tmdbEntry4 = (animeTmdbMap as Record<string, { tmdb: number; season: number }>)[slug];
    if (tmdbEntry4) {
      streamUrl = `https://vidsrc.pm/embed/tv/${tmdbEntry4.tmdb}/${tmdbEntry4.season}-${ep}`;
    } else {
      let malId4: number | undefined = rawMal ? Number(rawMal) : undefined;
      if (!malId4 && slug) malId4 = (animeMalMap as Record<string, number>)[slug];
      if (malId4) {
        streamUrl = `https://vidsrc.pm/embed/anime/${malId4}/${ep}`;
      }
    }
  }

  // 1. Try real Arabic Anime Slayer stream first (Exact, 1080p, Hardsubbed Arabic, Real Episode)
  if (!streamUrl && slug) {
    const directSlayer = await resolveSlayerStream(slug, ep);
    if (directSlayer) {
      streamUrl = directSlayer;
      isDirectVideo = true;
    }
  }

  // 2. If Slayer fails or hash exists, try resolving direct working mirror (Lulustream / MegaMax)
  if (!streamUrl && hash) {
    const direct = await resolveMegamax(hash);
    if (direct) {
      streamUrl = direct;
    } else {
      streamUrl = `https://megamax.me/iframe/${hash}`;
    }
  }

  // 3. Fallback: MultiEmbed / VidSrc with Japanese audio + subtitles
  if (!streamUrl) {
    const tmdbEntry = (animeTmdbMap as Record<string, { tmdb: number; season: number }>)[slug];
    if (tmdbEntry) {
      streamUrl = `https://multiembed.mov/?video_id=${tmdbEntry.tmdb}&tmdb=1&s=${tmdbEntry.season}&e=${ep}`;
    } else {
      let malId: number | undefined = rawMal ? Number(rawMal) : undefined;
      if (!malId && slug) {
        malId = (animeMalMap as Record<string, number>)[slug];
      }
      if (malId) {
        streamUrl = `https://www.2embed.cc/embed/anime/${malId}/${ep}`;
      } else {
        const cleanTitle = slug.replace(/-(?:19|20)\d{2}.*$/, "").replace(/-/g, " ");
        streamUrl = `https://multiembed.mov/?video_id=${encodeURIComponent(cleanTitle)}&tmdb=1&s=1&e=${ep}`;
      }
    }
  }

  // If it's a direct MP4 video, render high-performance Plyr/HTML5 video player with Arabic UI & full audio control
  if (isDirectVideo) {
    const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">
  <title>راست أنمي - مشغل الفيديو المباشر (FHD)</title>
  <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      background: #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .plyr--video {
      width: 100% !important;
      height: 100% !important;
      max-height: 100vh;
    }
    .plyr__video-wrapper {
      width: 100% !important;
      height: 100% !important;
    }
    video {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
    }
    :root {
      --plyr-color-main: #ffffff;
      --plyr-video-control-color: #ffffff;
      --plyr-video-control-color-hover: #ffffff;
    }
  </style>
</head>
<body>
  <video id="player" playsinline controls preload="auto">
    <source src="${streamUrl}" type="video/mp4" size="1080" />
    متصفحك لا يدعم تشغيل هذا الفيديو.
  </video>

  <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const player = new Plyr('#player', {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'pip',
          'airplay',
          'fullscreen'
        ],
        i18n: {
          restart: 'إعادة التشغيل',
          rewind: 'ترجيع {seektime} ثانية',
          play: 'تشغيل',
          pause: 'إيقاف مؤقت',
          fastForward: 'تقديم {seektime} ثانية',
          seek: 'تقديم/ترجيع',
          played: 'تم التشغيل',
          buffered: 'تم التحميل',
          currentTime: 'الوقت الحالي',
          duration: 'المدة الإجمالية',
          volume: 'مستوى الصوت',
          mute: 'كتم الصوت',
          unmute: 'إلغاء الكتم',
          enableCaptions: 'تفعيل الترجمة',
          disableCaptions: 'إيقاف الترجمة',
          enterFullscreen: 'ملء الشاشة',
          exitFullscreen: 'الخروج من ملء الشاشة',
          settings: 'الإعدادات',
          speed: 'السرعة',
          normal: 'عادي',
          quality: 'الجودة',
          loop: 'تكرار'
        },
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        autoplay: false,
      });

      // Ensure full volume by default
      player.volume = 1;
      player.muted = false;
    });
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "ALLOWALL",
        "Cache-Control": "public, max-age=1800",
      },
    });
  }

  // Otherwise, render clean iframe with fallback handling
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>راست أنمي - مشغل الفيديو المباشر</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #000;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #player-frame {
      width: 100%;
      height: 100%;
      border: 0;
      outline: none;
    }
    .fallback-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: #a1a1aa;
    }
    .fallback-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .fallback-desc {
      font-size: 13px;
      line-height: 1.6;
      max-width: 420px;
      margin-bottom: 16px;
    }
    .fallback-btn {
      background: #e11d48;
      color: #fff;
      border: 0;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .fallback-btn:hover {
      background: #be123c;
    }
  </style>
</head>
<body>
  ${
    streamUrl
      ? `<iframe
          id="player-frame"
          src="${streamUrl}"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>`
      : `<div class="fallback-box">
          <div style="font-size: 36px; margin-bottom: 12px;">⏳</div>
          <div class="fallback-title">هذه الحلقة قيد التجهيز والبث</div>
          <div class="fallback-desc">لم تتوفر مصادر البث المباشر لهذه الحلقة بعد في خوادم المشاهدة. يرجى تجربة السيرفرات البديلة بالأسفل أو العودة لاحقاً.</div>
          <button class="fallback-btn" onclick="window.location.reload()">إعادة المحاولة ⟳</button>
        </div>`
  }
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "ALLOWALL",
      "Cache-Control": "public, no-store, no-cache, must-revalidate",
    },
  });
}
