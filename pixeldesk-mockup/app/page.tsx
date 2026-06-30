import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import TrailerSection from "./components/TrailerSection";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#13090f",
  surf: "#1f1419",
  card: "#1f1419",
  cardBorder: "#3d2a35",
  accent: "#ff7a5c",
  text: "#f5f0e8",
  muted: "#b8a8b8",
};

async function getFeaturedMovie() {
  const { data } = await supabase
    .from("movies")
    .select(
      "slug, title_th, backdrop_path, vote_average, trailer_youtube_key, " +
        "ai_content(meta_description), movie_genres(genres(name_th))"
    )
    .eq("status", "published")
    .order("popularity", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as any;
}

async function getPopularMovie() {
  const { data } = await supabase
    .from("movies")
    .select(
      "slug, title_th, backdrop_path, vote_average, trailer_youtube_key, " +
        "ai_content(meta_description), movie_genres(genres(name_th))"
    )
    .eq("status", "published")
    .order("vote_average", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as any;
}

async function getLatestMovie() {
  const { data } = await supabase
    .from("movies")
    .select(
      "slug, title_th, backdrop_path, vote_average, trailer_youtube_key, " +
        "ai_content(meta_description), movie_genres(genres(name_th))"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as any;
}

async function getProviders() {
  const { data } = await supabase.from("providers").select("id, name, slug").order("name");
  return data ?? [];
}

async function getHeroTrailerOverride() {
  const { data } = await supabase
    .from("site_settings")
    .select("hero_trailer_url")
    .eq("id", 1)
    .maybeSingle();
  return data?.hero_trailer_url ?? null;
}

async function getMoviesForProvider(providerId: number) {
  const { data } = await supabase
    .from("movie_providers")
    .select("movies(slug, title_th, poster_path, vote_average, status)")
    .eq("provider_id", providerId)
    .eq("is_active", true)
    .limit(10);
  return (data ?? [])
    .map((row: any) => row.movies)
    .filter((m: any) => m && m.status === "published");
}

async function getLatestReviews() {
  const { data } = await supabase
    .from("movies")
    .select("slug, title_th, poster_path, vote_average")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

function MovieRow({ title, movies }: { title: string; movies: any[] }) {
  if (movies.length === 0) return null;
  return (
    <div style={{ marginBottom: "2rem" }}>
      <p className={pixelFont.className} style={{ fontSize: 11, color: COLORS.text, margin: "0 0 12px" }}>
        {title}
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {movies.map((m) => (
          <Link
            key={m.slug}
            href={"/movies/" + m.slug}
            style={{
              textDecoration: "none",
              flex: "0 0 112px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 152,
                background: COLORS.surf,
                borderRadius: "6px 6px 0 0",
                border: "1px solid " + COLORS.cardBorder,
                borderBottom: "none",
                overflow: "hidden",
              }}
            >
              {m.poster_path && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={"https://image.tmdb.org/t/p/w200" + m.poster_path}
                  alt={m.title_th}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div
              style={{
                background: COLORS.card,
                border: "1px solid " + COLORS.cardBorder,
                borderTop: "none",
                borderRadius: "0 0 6px 6px",
                padding: 8,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.title_th}
              </p>
              {m.vote_average !== null && (
                <span style={{ color: COLORS.accent, fontSize: 10 }}>
                  ★ {Number(m.vote_average).toFixed(1)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [featured, popular, latestMovie, providers, latest, heroTrailerOverride] = await Promise.all([
    getFeaturedMovie(),
    getPopularMovie(),
    getLatestMovie(),
    getProviders(),
    getLatestReviews(),
    getHeroTrailerOverride(),
  ]);

  const providerMovies = await Promise.all(
    providers.map((p) => getMoviesForProvider(p.id))
  );


  return (
    <div style={{ background: COLORS.bg, color: COLORS.text }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem" }}>
        <Image src="/logo.png" alt="PIXELDESK" width={160} height={40} priority style={{ height: 36, width: "auto" }} />
        <nav style={{ display: "flex", gap: 18, fontSize: 13, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>หน้าแรก</Link>
          <Link href="/platforms" style={{ color: COLORS.text, textDecoration: "none" }}>แพลตฟอร์ม</Link>
          <Link href="/movies" style={{ color: COLORS.text, textDecoration: "none" }}>รีวิวหนัง</Link>
          <Link href="/ranking" style={{ color: COLORS.text, textDecoration: "none" }}>จัดอันดับ</Link>
        </nav>
      </div>

      <HeroBanner
        trending={featured}
        popular={popular}
        latest={latestMovie}
        heroTrailerOverride={heroTrailerOverride}
        colors={COLORS}
        pixelFontClassName={pixelFont.className}
      />

      {heroTrailerOverride && (
        <TrailerSection
          videoId={heroTrailerOverride}
          title={featured?.title_th || "ตัวอย่างหนังแนะนำ"}
          description={featured?.ai_content?.meta_description}
          backdropPath={featured?.backdrop_path}
          colors={COLORS}
        />
      )}

      <div style={{ padding: "2rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem", maxWidth: 720 }}>
          <h1 className={pixelFont.className} style={{ fontSize: 16, color: "#fff", margin: "0 0 12px", lineHeight: 1.6 }}>
            แนะนำหนัง Netflix ดูอะไรดี พร้อมหนังใหม่จาก HBO Max, Apple TV และ Viu
          </h1>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.7 }}>
            pixeldeskth รวมรีวิวหนังภาษาไทยต้นฉบับ พร้อมเช็คว่าหนังเรื่องที่อยากดู
            มีอยู่บนแพลตฟอร์มไหนบ้าง ไม่ต้องเสียเวลาเปิดหลายแอปหาเอง
            อัปเดตหนังใหม่ทุกวันจากทุกแพลตฟอร์มสตรีมมิ่งหลักในไทย
          </p>
        </div>
        <MovieRow title="รีวิวล่าสุด" movies={latest} />
        {providers.map((p, i) => (
          <MovieRow key={p.slug} title={"หนัง " + p.name.toUpperCase()} movies={providerMovies[i]} />
        ))}

        <div style={{ marginTop: "3rem", maxWidth: 760 }}>
          <h2 className={pixelFont.className} style={{ fontSize: 14, color: "#fff", margin: "0 0 14px", lineHeight: 1.6 }}>
            แนะนำหนัง Netflix ดูอะไรดี เช็คได้ที่ pixeldeskth
          </h2>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
            หลายคนเปิด Netflix แล้วเจอหนังให้เลือกเยอะจนตัดสินใจไม่ได้ pixeldeskth
            แก้ปัญหานี้ด้วยการรวบรวมหนัง Netflix ที่น่าดูมาไว้ในที่เดียว
            พร้อมรีวิวภาษาไทยที่เขียนขึ้นใหม่ทั้งหมด ไม่ใช่แปลตรงจากเรื่องย่อต้นฉบับ
            เพื่อให้อ่านเข้าใจง่ายและได้มุมมองวิเคราะห์จริง ไม่ใช่แค่สรุปพล็อตเรื่อง
          </p>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
            แต่ละรีวิวบนเว็บนี้บอกครบทั้งจุดเด่น จุดสังเกต คำถามที่พบบ่อยเกี่ยวกับหนังเรื่องนั้น
            และที่สำคัญคือบอกชัดว่าหนังเรื่องไหนดูได้บนแพลตฟอร์มไหน ไม่ต้องเปิดสลับหลายแอป
            เพื่อหาว่าหนังเรื่องที่อยากดูอยู่ที่ไหน
          </p>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, margin: "0 0 14px" }}>
            นอกจาก Netflix แล้ว pixeldeskth ยังครอบคลุมหนังจาก HBO Max ที่เด่นเรื่องหนังฟอร์มยักษ์
            และซีรีส์ตำนานจากหลายค่าย Apple TV ที่มีงานคุณภาพสูงแม้จำนวนจะน้อยกว่า
            และ Viu ที่อัปเดตซีรีส์เอเชียได้รวดเร็ว ทุกแพลตฟอร์มมีหน้ารวมหนังของตัวเอง
            ที่อัปเดตทุกวันให้ตามหนังใหม่ที่เพิ่งลงสตรีมมิ่ง
          </p>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8 }}>
            ดูหนังตามแพลตฟอร์มที่ใช้อยู่ได้ที{"่"}
            <Link href="/platforms" style={{ color: COLORS.accent, textDecoration: "underline" }}>
              หน้ารวมแพลตฟอร์ม
            </Link>
            {" "}หรือไล่ดูรีวิวหนังทั้งหมดได้ที่{" "}
            <Link href="/movies" style={{ color: COLORS.accent, textDecoration: "underline" }}>
              หน้ารีวิวหนัง
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}