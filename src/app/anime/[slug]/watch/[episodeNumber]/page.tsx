import { notFound } from "next/navigation";
import { getEpisodeWithServers, getAllAnimes } from "@/lib/animeService";
import WatchPlayer from "@/components/WatchPlayer";

export const dynamic = "force-dynamic";

export default async function WatchEpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episodeNumber: string }>;
}) {
  const { slug, episodeNumber } = await params;
  const num = parseInt(episodeNumber, 10);

  const data = await getEpisodeWithServers(slug, num);

  if (!data || !data.anime || !data.episode) {
    notFound();
  }

  // Fetch recommended animes (only 6 items, limited at database query level for speed)
  const recommendedAnimes = (await getAllAnimes(7))
    .filter((a) => a.slug !== slug)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      poster: a.poster,
      rating: a.rating ? a.rating.toString() : "8.5",
      type: a.type || "TV",
    }));

  const episodesList = (data.anime.episodes || []).map((e) => ({
    number: e.number,
    title: e.title || `الحلقة ${e.number}`,
    thumbnail: e.thumbnail || data.anime.poster,
    duration: e.duration || "24 دقيقة",
  }));

  // Generate robust multi-server options for immediate reliability
  const servers = [
    {
      name: "سيرفر RUST 1 (FHD مباشر)",
      url: `/api/player?slug=${data.anime.slug}&ep=${data.episode.number}`,
      quality: "1080p",
    },
    {
      name: "سيرفر RUST 2 (احتياطي)",
      url: `/api/player?slug=${data.anime.slug}&ep=${data.episode.number}&srv=2`,
      quality: "1080p",
    },
    {
      name: "سيرفر RUST 3 (سريع)",
      url: `/api/player?slug=${data.anime.slug}&ep=${data.episode.number}&srv=3`,
      quality: "720p",
    },
    {
      name: "سيرفر VidPrime (جودة عالية)",
      url: `/api/player?slug=${data.anime.slug}&ep=${data.episode.number}&srv=4`,
      quality: "1080p",
    },
  ];

  return (
    <div className="py-6 px-2 sm:px-4 max-w-7xl mx-auto">
      <WatchPlayer
        animeSlug={data.anime.slug}
        animeTitle={data.anime.title}
        animeTitleJapanese={data.anime.japaneseTitle || ""}
        animePoster={data.anime.poster}
        animeSynopsis={data.anime.synopsis || ""}
        animeType={data.anime.type || "TV"}
        animeStatus={data.anime.status || "مستمر"}
        animeYear={data.anime.releaseYear || 2024}
        animeRating={data.anime.rating ? data.anime.rating.toString() : "8.5"}
        animeGenres={data.anime.genres || []}
        currentEpisode={data.episode.number}
        totalEpisodes={
          data.anime.totalEpisodes
            ? typeof data.anime.totalEpisodes === "number"
              ? data.anime.totalEpisodes
              : parseInt(data.anime.totalEpisodes, 10) || episodesList.length
            : episodesList.length
        }
        servers={servers}
        episodesList={episodesList}
        recommendedAnimes={recommendedAnimes}
        animeId={data.anime.id}
      />
    </div>
  );
}
