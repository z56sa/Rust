import { db } from "@/db";
import { animes, episodes, episodeServers, downloadLinks } from "@/db/schema";
import { eq, desc, sql, and, or, ne } from "drizzle-orm";

// Helper to ensure valid image URL without broken links
export function sanitizeImageUrl(url: string | null | undefined, fallback = "/logo.png"): string {
  if (!url || !url.trim() || url.includes("undefined") || url.includes("null")) return fallback;
  return url;
}

// Fetch all anime series with Pagination (excluding Movies, 18 items per page)
export async function getAllAnimesPaginated(page = 1, pageSize = 18) {
  try {
    const offset = (page - 1) * pageSize;
    const [list, totalRes] = await Promise.all([
      db
        .select()
        .from(animes)
        .where(ne(animes.type, "Movie"))
        .orderBy(desc(animes.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(animes)
        .where(ne(animes.type, "Movie")),
    ]);

    const totalCount = Number(totalRes[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: list.map((a) => ({
        ...a,
        poster: sanitizeImageUrl(a.poster),
        banner: sanitizeImageUrl(a.banner),
        genres: JSON.parse(a.genres || "[]") as string[],
      })),
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch paginated animes:", error);
    return { items: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  }
}

// Fetch all animes
export async function getAllAnimes(limitCount?: number) {
  try {
    let query = db.select().from(animes).orderBy(desc(animes.createdAt));
    const list = limitCount ? await query.limit(limitCount) : await query;
    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch animes:", error);
    return [];
  }
}

// Fetch ongoing animes with Pagination (18 items per page)
export async function getOngoingAnimesPaginated(page = 1, pageSize = 18) {
  try {
    const offset = (page - 1) * pageSize;
    const [list, totalRes] = await Promise.all([
      db
        .select()
        .from(animes)
        .where(eq(animes.status, "مستمر"))
        .orderBy(desc(animes.releaseYear), desc(animes.views), desc(animes.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(animes)
        .where(eq(animes.status, "مستمر")),
    ]);

    const totalCount = Number(totalRes[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: list.map((a) => ({
        ...a,
        poster: sanitizeImageUrl(a.poster),
        banner: sanitizeImageUrl(a.banner),
        genres: JSON.parse(a.genres || "[]") as string[],
      })),
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch paginated ongoing animes:", error);
    return { items: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  }
}

// Fetch ongoing animes
export async function getOngoingAnimes(limitCount?: number) {
  try {
    let query = db
      .select()
      .from(animes)
      .where(eq(animes.status, "مستمر"))
      .orderBy(desc(animes.releaseYear), desc(animes.views), desc(animes.createdAt));
      
    const list = limitCount ? await query.limit(limitCount) : await query;
    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch ongoing animes:", error);
    return [];
  }
}

// Fetch seasonal popular animes (أشهر أنميات الموسم)
export async function getSeasonalPopularAnimes(limitCount = 20) {
  try {
    const list = await db
      .select()
      .from(animes)
      .where(eq(animes.status, "مستمر"))
      .orderBy(desc(animes.views), desc(animes.rating))
      .limit(limitCount);
      
    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch seasonal popular animes:", error);
    return [];
  }
}

// Fetch top watched TV anime
export async function getTopWatchedAnimes(limitCount = 10) {
  try {
    const list = await db
      .select()
      .from(animes)
      .where(or(eq(animes.type, "TV"), eq(animes.type, "ONA")))
      .orderBy(desc(animes.views))
      .limit(limitCount);

    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch top watched animes:", error);
    return [];
  }
}

// Fetch movies with pagination (18 items per page)
export async function getMoviesPaginated(page = 1, pageSize = 18) {
  try {
    const offset = (page - 1) * pageSize;
    const [list, totalRes] = await Promise.all([
      db
        .select()
        .from(animes)
        .where(eq(animes.type, "Movie"))
        .orderBy(desc(animes.createdAt), desc(animes.releaseYear))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(animes)
        .where(eq(animes.type, "Movie")),
    ]);

    const totalCount = Number(totalRes[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items: list.map((a) => ({
        ...a,
        poster: sanitizeImageUrl(a.poster),
        banner: sanitizeImageUrl(a.banner),
        genres: JSON.parse(a.genres || "[]") as string[],
      })),
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch paginated movies:", error);
    return { items: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  }
}

// Fetch latest movies
export async function getLatestMovies(limitCount = 18) {
  try {
    const list = await db
      .select()
      .from(animes)
      .where(eq(animes.type, "Movie"))
      .orderBy(desc(animes.createdAt), desc(animes.releaseYear))
      .limit(limitCount);

    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch latest movies:", error);
    return [];
  }
}

// Fetch top watched movies
export async function getTopWatchedMovies(limitCount = 10) {
  try {
    const list = await db
      .select()
      .from(animes)
      .where(eq(animes.type, "Movie"))
      .orderBy(desc(animes.views), desc(animes.rating))
      .limit(limitCount);

    return list.map((a) => ({
      ...a,
      poster: sanitizeImageUrl(a.poster),
      banner: sanitizeImageUrl(a.banner),
      genres: JSON.parse(a.genres || "[]") as string[],
    }));
  } catch (error) {
    console.error("Failed to fetch top watched movies:", error);
    return [];
  }
}

// In-memory cache for latest episodes to survive transient DB connection timeouts
let cachedLatestEpisodes: any[] = [];
let lastLatestEpisodesFetch = 0;
const LATEST_EPISODES_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Fetch latest released episodes
export async function getLatestEpisodesWithAnime(limitCount = 18) {
  // If cache is fresh, return it immediately
  if (cachedLatestEpisodes.length > 0 && Date.now() - lastLatestEpisodesFetch < LATEST_EPISODES_CACHE_TTL) {
    return cachedLatestEpisodes.slice(0, limitCount);
  }

  try {
    const episodeList = await db
      .select({
        episode: episodes,
        anime: animes,
      })
      .from(episodes)
      .innerJoin(animes, eq(episodes.animeId, animes.id))
      .orderBy(desc(episodes.createdAt), desc(episodes.number))
      .limit(limitCount);

    if (episodeList && episodeList.length > 0) {
      const formatted = episodeList.map((row) => ({
        anime: {
          ...row.anime,
          poster: sanitizeImageUrl(row.anime.poster),
          banner: sanitizeImageUrl(row.anime.banner),
          genres: JSON.parse(row.anime.genres || "[]") as string[],
        },
        episode: {
          ...row.episode,
          thumbnail: sanitizeImageUrl(row.episode.thumbnail, sanitizeImageUrl(row.anime.poster)),
        },
      }));
      cachedLatestEpisodes = formatted;
      lastLatestEpisodesFetch = Date.now();
      return formatted;
    }
  } catch (error) {
    console.error("Failed to fetch latest episodes (using cache fallback if available):", error);
  }

  // Fallback to cache if available
  if (cachedLatestEpisodes.length > 0) {
    return cachedLatestEpisodes.slice(0, limitCount);
  }

  return [];
}

// Fetch single anime by slug
export async function getAnimeBySlug(slug: string) {
  try {
    const animeList = await db.select().from(animes).where(eq(animes.slug, slug)).limit(1);
    if (!animeList.length) return null;

    const animeItem = animeList[0];
    const episodeList = await db
      .select()
      .from(episodes)
      .where(eq(episodes.animeId, animeItem.id))
      .orderBy(desc(episodes.number));

    return {
      ...animeItem,
      poster: sanitizeImageUrl(animeItem.poster),
      banner: sanitizeImageUrl(animeItem.banner),
      genres: JSON.parse(animeItem.genres || "[]") as string[],
      episodes: episodeList.map((e) => ({
        ...e,
        thumbnail: sanitizeImageUrl(e.thumbnail, sanitizeImageUrl(animeItem.poster)),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch anime by slug:", error);
    return null;
  }
}

// Fetch episode with its streaming & download servers
export async function getEpisodeWithServers(slug: string, episodeNumber: number) {
  try {
    const animeData = await getAnimeBySlug(slug);
    if (!animeData) return null;

    const episodeItem = animeData.episodes.find((ep) => ep.number === episodeNumber);
    if (!episodeItem) return null;

    const [servers, downloads] = await Promise.all([
      db.select().from(episodeServers).where(eq(episodeServers.episodeId, episodeItem.id)),
      db.select().from(downloadLinks).where(eq(downloadLinks.episodeId, episodeItem.id)),
    ]);

    return {
      anime: animeData,
      episode: {
        ...episodeItem,
        thumbnail: sanitizeImageUrl(episodeItem.thumbnail, animeData.poster),
        servers,
        downloadLinks: downloads,
      },
    };
  } catch (error) {
    console.error("Failed to fetch episode with servers:", error);
    return null;
  }
}

// Fetch all genres with count
export async function getAllGenresWithCount() {
  try {
    const all = await db.select({ genres: animes.genres }).from(animes);
    const map = new Map<string, number>();

    all.forEach((item) => {
      try {
        const parsed = JSON.parse(item.genres || "[]") as string[];
        parsed.forEach((g) => {
          if (g && g.trim()) {
            map.set(g, (map.get(g) || 0) + 1);
          }
        });
      } catch (e) {}
    });

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Failed to get genres count:", error);
    return [];
  }
}

// Fetch animes by genre
export async function getAnimesByGenre(genre: string) {
  try {
    const all = await getAllAnimes();
    return all.filter((a) =>
      a.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase())
    );
  } catch (error) {
    console.error("Failed to fetch animes by genre:", error);
    return [];
  }
}
