import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// جدول الأنميات
export const animes = sqliteTable("animes", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  japaneseTitle: text("japanese_title"),
  synopsis: text("synopsis"),
  poster: text("poster").notNull(),
  banner: text("banner").notNull(),
  rating: real("rating").default(0),
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
export const episodes = sqliteTable("episodes", {
  id: text("id").primaryKey(),
  animeId: text("anime_id")
    .notNull()
    .references(() => animes.id, { onDelete: "cascade" }),
  number: real("number").notNull(), // real to support 7.5 etc
  title: text("title").notNull(),
  thumbnail: text("thumbnail"),
  releaseDate: text("release_date"),
  duration: text("duration").default("24 دقيقة"),
  isFiller: integer("is_filler").default(0), // 1 = فلر, 0 = قصة أصلية (كانون)
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// جدول سيرفرات المشاهدة
export const episodeServers = sqliteTable("episode_servers", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  quality: text("quality").default("1080p"),
});

// جدول روابط التحميل المباشرة
export const downloadLinks = sqliteTable("download_links", {
  id: text("id").primaryKey(),
  episodeId: text("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  quality: text("quality").default("1080p"),
});

// جدول المستخدمين والحسابات
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // 'admin' | 'user'
  avatar: text("avatar"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// جدول قائمة الأنميات للمستخدم (أشاهده، أنوي مشاهدته، أكملته، المفضلة)
export const userLists = sqliteTable("user_lists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  animeId: text("anime_id").notNull(),
  status: text("status").notNull(), // 'watching' | 'plan' | 'completed' | 'favorite'
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
