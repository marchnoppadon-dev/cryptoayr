import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Image from "next/image";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#1c1320",
  surf: "#2a2030",
  gold: "#ffd24a",
  text: "#f5f0e8",
  muted: "#b8a8b8",
};
const CARD_COLORS = ["#e0608f", "#e0a83c", "#8b7fd1", "#2bb89c", "#3a8bd8"];
const CARD_TEXT: Record<string, string> = {
  "#e0608f": "#3d1428",
  "#e0a83c": "#412a06",
  "#8b7fd1": "#241f57",
  "#2bb89c": "#0a3b30",
  "#3a8bd8": "#0c2c4d",
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

async function getProviders() {
  const { data } = await supabase.from("providers").select("id, name, slug").order("name");
  return data ?? [];
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
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {movies.map((m, i) => {
          const bg = CARD_COLORS[i % CARD_COLORS.length];
          return (
            <Link
              key={m.slug}
              href={"/movies/" + m.slug}
              style={{
                background: bg,
                borderRadius: 10,
                padding: 10,
                textDecoration: "none",
                flex: "0 0 140px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 88,
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: 5,
                  marginBottom: 8,
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
              <p className={pixelFont.className} style={{ fontSize: 9, color: CARD_TEXT[bg], margin: "0 0 6px", lineHeight: 1.5 }}>
                {m.title_th}
              </p>
              {m.vote_average !== null && (
                <span style={{ color: CARD_TEXT[bg], fontSize: 11 }}>
                  ★ {Number(m.vote_average).toFixed(1)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [featured, providers, latest] = await Promise.all([
    getFeaturedMovie(),
    getProviders(),
    getLatestReviews(),
  ]);

  const providerMovies = await Promise.all(
    providers.map((p) => getMoviesForProvider(p.id))
  );

  const genreNames = featured?.movie_genres
    ?.map((g: any) => g.genres?.name_th)
    .filter(Boolean)
    .join(" · ");

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

      {featured && (
        <div
          style={{
            position: "relative",
            minHeight: 380,
            backgroundImage: featured.backdrop_path
              ? "linear-gradient(to top, rgba(28,19,32,1) 0%, rgba(28,19,32,0.3) 50%, rgba(28,19,32,0.1) 100%), url(https://image.tmdb.org/t/p/w1280" + featured.backdrop_path + ")"
              : undefined,
          backgroundColor: COLORS.surf,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-end",
            padding: "2rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p className={pixelFont.className} style={{ fontSize: 9, color: COLORS.gold, margin: "0 0 10px" }}>
              กำลังมาแรง
            </p>
            <p className={pixelFont.className} style={{ fontSize: 22, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
              {featured.title_th}
            </p>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 10px" }}>
              {genreNames || "ภาพยนตร์"}
              {featured.vote_average !== null ? "  ★ " + Number(featured.vote_average).toFixed(1) : ""}
            </p>
            {featured.ai_content?.meta_description && (
              <p style={{ fontSize: 14, color: COLORS.text, margin: "0 0 18px", lineHeight: 1.6, maxWidth: 480 }}>
                {featured.ai_content.meta_description}
              </p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              {featured.trailer_youtube_key && (
                
                  <a href={"https://www.youtube.com/watch?v=" + featured.trailer_youtube_key}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: COLORS.gold, color: "#3d2b04", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}
                >
                  ▶ ดูเทรลเลอร์
                </a>
              )}
              <Link
                href={"/movies/" + featured.slug}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}
              >
                + ดูรายละเอียด
              </Link>
            </div>
          </div>
        </div>
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
            <Link href="/platforms" style={{ color: COLORS.gold, textDecoration: "underline" }}>
              หน้ารวมแพลตฟอร์ม
            </Link>
            {" "}หรือไล่ดูรีวิวหนังทั้งหมดได้ที่{" "}
            <Link href="/movies" style={{ color: COLORS.gold, textDecoration: "underline" }}>
              หน้ารีวิวหนัง
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}