import { pgTable, text, integer, real, doublePrecision } from "drizzle-orm/pg-core";

// جدول الأنميات
export const animes = pgTable("animes", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  japaneseTitle: text("japanese_title"),
  synopsis: text("synopsis"),
  poster: text("poster").notNull(),
  banner: text("banner").notNull(),
  rating: doublePrecision("rating").default(0),
  genres: text("genres").notNull(), // JSON string
  status: text("status").notNull().default("مستمر"),
  type: text("type").notNull().default("TV"),
  season: text("season"),
  releaseYear: integer("release_year"),
  totalEpisodes: text("total_episodes").default("?"),
  studio: text("studio"),
  trailerUrl: text("trailer_url"),
  views: integer("views").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// جدول الحلقات مع دعم الفلر (isFiller)
export const episodes = pgTable("episodes", {
  id: text("id").primaryKey(),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  number: doublePrecision("number").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  releaseDate: text("release_date"),
  duration: text("duration").default("24 دقيقة"),
  isFiller: integer("is_filler").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// جدول سيرفرات المشاهدة
export const episodeServers = pgTable("episode_servers", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  quality: text("quality").default("1080p"),
});

// جدول روابط التحميل المباشرة
export const downloadLinks = pgTable("download_links", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  quality: text("quality").default("1080p"),
});

// جدول المستخدمين والحسابات
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  avatar: text("avatar"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// جدول قائمة الأنميات للمستخدم
export const userLists = pgTable("user_lists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  animeId: text("anime_id").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
