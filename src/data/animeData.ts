export interface EpisodeServer {
  id: string;
  name: string;
  url: string;
  quality: string;
  isDownloadable?: boolean;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  releaseDate: string;
  duration: string;
  servers: EpisodeServer[];
  downloadLinks: { name: string; url: string; quality: string }[];
}

export interface Anime {
  id: string;
  slug: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  poster: string;
  banner: string;
  rating: number;
  genres: string[];
  status: "مستمر" | "مكتمل";
  type: "TV" | "Movie" | "OVA";
  season: string;
  releaseYear: number;
  totalEpisodes: number | string;
  studio: string;
  views: number;
  episodes: Episode[];
}

export const mockAnimes: Anime[] = [
  {
    id: "1",
    slug: "solo-leveling",
    title: "سولو ليفلينج (Solo Leveling: Arise from the Shadow)",
    japaneseTitle: "俺だけレベルアップな件",
    synopsis: "في عالم تتصل فيه بوابات بأبعاد أخرى وتضم وحوشًا خطيرة، يكتسب بعض البشر قوى خارقة تُعرف بالصيادين. سونغ جين وو، المعروف بأنه 'أضعف صياد في العالم من الفئة E'، يعثر على زنزانة سرية غامضة تقوده ليصبح الصياد الوحيد القادر على رفع مستواه بلا حدود.",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    rating: 8.9,
    genres: ["أكشن", "فنتازيا", "مغامرات", "قوى خارقة"],
    status: "مستمر",
    type: "TV",
    season: "شتاء 2024",
    releaseYear: 2024,
    totalEpisodes: 24,
    studio: "A-1 Pictures",
    views: 452000,
    episodes: [
      {
        id: "sl-ep-1",
        number: 1,
        title: "أنا معتاد على ذلك",
        thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
        releaseDate: "2024-01-07",
        duration: "24 دقيقة",
        servers: [
          { id: "s1", name: "Risto Fast Server (HD)", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" },
          { id: "s2", name: "Vidmoly Player", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "720p" },
          { id: "s3", name: "Streamtape VIP", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" },
          { id: "s4", name: "Mp4Upload Fast", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "480p" }
        ],
        downloadLinks: [
          { name: "Mega (1080p FHD)", quality: "1080p", url: "#" },
          { name: "Google Drive (720p HD)", quality: "720p", url: "#" },
          { name: "Mediafire (480p SD)", quality: "480p", url: "#" }
        ]
      },
      {
        id: "sl-ep-2",
        number: 2,
        title: "إذا كان لدي فرصة أخرى",
        thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
        releaseDate: "2024-01-14",
        duration: "24 دقيقة",
        servers: [
          { id: "s1", name: "Risto Fast Server (HD)", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" },
          { id: "s2", name: "Vidmoly Player", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "720p" }
        ],
        downloadLinks: [
          { name: "Mega (1080p FHD)", quality: "1080p", url: "#" }
        ]
      },
      {
        id: "sl-ep-3",
        number: 3,
        title: "إنه مثل لعبة",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
        releaseDate: "2024-01-21",
        duration: "24 دقيقة",
        servers: [
          { id: "s1", name: "Risto Fast Server (HD)", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" }
        ],
        downloadLinks: [
          { name: "Mega (1080p FHD)", quality: "1080p", url: "#" }
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "one-piece",
    title: "ون بيس (One Piece)",
    japaneseTitle: "ワンピース",
    synopsis: "مونكي دي لوفي شاب يطمح لأن يصبح ملك القراصنة القادم. ينطلق في رحلة لاكتشاف الكنز الأسطوري المعروف بـ 'ون بيس' برفقة طاقمه المخلص قبعة القش في مغامرات بحرية حافلة بالقتال والإثارة.",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    rating: 9.1,
    genres: ["أكشن", "مغامرات", "كوميديا", "دراما", "خيال"],
    status: "مستمر",
    type: "TV",
    season: "خريف 1999",
    releaseYear: 1999,
    totalEpisodes: "1100+",
    studio: "Toei Animation",
    views: 1250000,
    episodes: [
      {
        id: "op-ep-1110",
        number: 1110,
        title: "تحرك أسطول العمالقة! معركة جزيرة المستقبل",
        thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
        releaseDate: "2024-06-30",
        duration: "24 دقيقة",
        servers: [
          { id: "s1", name: "Risto Cloud HD", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" },
          { id: "s2", name: "Vidmoly HighSpeed", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "720p" }
        ],
        downloadLinks: [
          { name: "Mega (1080p)", quality: "1080p", url: "#" }
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "demon-slayer",
    title: "قاتل الشياطين (Kimetsu no Yaiba: Hashira Training Arc)",
    japaneseTitle: "鬼滅の刃 柱稽古編",
    synopsis: "تانجيرو كامادو يواصل تدريباته القاسية برفقة هاشيرا فيلق قتلة الشياطين للاستعداد للمواجهة الحاسمة المرتقبة ضد موزان كيبوتسوجي.",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    rating: 8.7,
    genres: ["أكشن", "شياطين", "تاريخي", "خوارق"],
    status: "مكتمل",
    type: "TV",
    season: "ربيع 2024",
    releaseYear: 2024,
    totalEpisodes: 8,
    studio: "ufotable",
    views: 890000,
    episodes: [
      {
        id: "ds-ep-1",
        number: 1,
        title: "لهزيمة موزان كيبوتسوجي",
        thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
        releaseDate: "2024-05-12",
        duration: "48 دقيقة",
        servers: [
          { id: "s1", name: "Risto Cloud 4K", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0", quality: "1080p" }
        ],
        downloadLinks: [
          { name: "Direct Server (1080p)", quality: "1080p", url: "#" }
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "jujutsu-kaisen",
    title: "جوجيتسو كايسن (Jujutsu Kaisen)",
    japaneseTitle: "呪術廻戦",
    synopsis: "يوجي إيتادوري طالب في المرحلة الثانوية يبتلع إصبع ملعون ينتمي لملك اللعنات ريومن سوكونا، ويدخل مدرسة الجوجيتسو لمحاربة اللعنات وحماية البشر.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80",
    rating: 8.8,
    genres: ["أكشن", "خوارق", "شياطين", "مدرسي"],
    status: "مكتمل",
    type: "TV",
    season: "خريف 2020",
    releaseYear: 2020,
    totalEpisodes: 47,
    studio: "MAPPA",
    views: 940000,
    episodes: []
  }
];

export const weeklySchedule = [
  { day: "السبت", animes: ["سولو ليفلينج", "بليتش: حرب الألف عام"] },
  { day: "الأحد", animes: ["ون بيس", "برج الإله الموسم 2"] },
  { day: "الإثنين", animes: ["المحقق كونان", "كينجدوم الموسم 5"] },
  { day: "الثلاثاء", animes: ["إعادة ولادتي في عالم سلايم"] },
  { day: "الأربعاء", animes: ["دكتور ستون", "طوكيو ريفينجرز"] },
  { day: "الخميس", animes: ["داندا دان (Dandadan)", "بلو لوك الموسم 2"] },
  { day: "الجمعة", animes: ["فرييرن: ما بعد نهاية الرحلة", "موشوكو تينسي"] }
];
