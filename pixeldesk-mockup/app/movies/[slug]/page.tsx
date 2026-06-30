import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

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

interface MovieDetail {
  id: string;
  slug: string;
  title_th: string;
  title_original: string | null;
  poster_path: string | null;
  release_date: string | null;
  runtime: number | null;
  vote_average: number | null;
  certification_th: string | null;
  trailer_youtube_key: string | null;
  ai_content: {
    meta_title: string | null;
    meta_description: string | null;
    review_body: string | null;
    pros_cons: { pros: string[]; cons: string[] } | null;
    faq: { question: string; answer: string }[] | null;
  } | null;
  movie_cast: { name: string; character: string | null; billing_order: number }[];
  movie_providers: {
    providers: { name: string; slug: string } | null;
  }[];
}

async function getMovie(slug: string): Promise<MovieDetail | null> {
  const { data, error } = await supabase
    .from("movies")
    .select(
      `id, slug, title_th, title_original, poster_path, release_date, runtime,
       vote_average, certification_th, trailer_youtube_key,
       ai_content(meta_title, meta_description, review_body, pros_cons, faq),
       movie_cast(name, character, billing_order),
       movie_providers(providers(name, slug))`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  return {
    ...data,
    ai_content: Array.isArray(data.ai_content)
      ? data.ai_content[0] ?? null
      : data.ai_content,
  } as unknown as MovieDetail;
}

async function getSimilarMovies(movieId: string) {
  const { data: genreRows } = await supabase
    .from("movie_genres")
    .select("genre_id")
    .eq("movie_id", movieId);

  const genreIds = (genreRows ?? []).map((g) => g.genre_id);
  if (genreIds.length === 0) return [];

  const { data } = await supabase
    .from("movie_genres")
    .select("movies(slug, title_th, poster_path, vote_average, status)")
    .in("genre_id", genreIds)
    .neq("movie_id", movieId)
    .limit(6);

  const seen = new Set<string>();
  return (data ?? [])
    .map((row: any) => row.movies)
    .filter((m: any) => m && m.status === "published" && !seen.has(m.slug) && seen.add(m.slug))
    .slice(0, 3);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovie(slug);
  if (!movie) return {};

  return {
    title: movie.ai_content?.meta_title ?? movie.title_th,
    description: movie.ai_content?.meta_description ?? undefined,
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await getMovie(slug);
  if (!movie) notFound();

  const similar = await getSimilarMovies(movie.id);
  const primaryProvider = movie.movie_providers[0]?.providers;
  const cast = [...movie.movie_cast].sort((a, b) => a.billing_order - b.billing_order);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const trailerUrl = movie.trailer_youtube_key
    ? "https://www.youtube.com/watch?v=" + movie.trailer_youtube_key
    : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title_th,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    dateCreated: movie.release_date ?? undefined,
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    contentRating: movie.certification_th ?? undefined,
    aggregateRating: movie.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          bestRating: 10,
        }
      : undefined,
    review: movie.ai_content?.review_body
      ? {
          "@type": "Review",
          author: { "@type": "Organization", name: "pixeldeskth" },
          reviewBody: movie.ai_content.review_body,
        }
      : undefined,
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, padding: "1.5rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: COLORS.muted }}>
          หน้าแรก
        </Link>{" "}
        / รีวิวหนัง
      </nav>

      <div
        style={{
          background: COLORS.surf,
          border: "1px solid " + COLORS.cardBorder,
          borderRadius: 10,
          padding: 18,
          display: "flex",
          gap: 16,
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: 96,
            height: 136,
            background: "rgba(0,0,0,0.18)",
            borderRadius: 5,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {movie.poster_path && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title_th}
              width={96}
              height={136}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className={pixelFont.className} style={{ fontSize: 18, color: "#fff", margin: "0 0 8px", lineHeight: 1.5 }}>
            {movie.title_th}
          </h1>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 10px" }}>
            {releaseYear ?? "-"} · {movie.runtime ? `${movie.runtime} นาที` : "-"} ·{" "}
            {movie.certification_th ?? "ไม่ระบุเรต"}
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {movie.vote_average !== null && (
              <span style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600 }}>
                ★ {movie.vote_average.toFixed(1)}/10
              </span>
            )}
            {primaryProvider && (
              <Link
                href={`/platforms/${primaryProvider.slug}`}
                style={{
                  background: COLORS.bg,
                  border: "1px solid " + COLORS.cardBorder,
                  color: COLORS.text,
                  fontSize: 10,
                  padding: "3px 9px",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                {primaryProvider.name.toUpperCase()}
              </Link>
            )}
            {trailerUrl && (
              
                <a href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: COLORS.accent,
                  color: "#3d1006",
                  fontSize: 10,
                  padding: "4px 10px",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
              >
                ▶ ดูเทรลเลอร์
              </a>
            )}
          </div>
        </div>
      </div>

      {movie.ai_content?.review_body && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            รีวิว
          </p>
          {movie.ai_content.review_body.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.8, margin: "0 0 1rem" }}>
              {para}
            </p>
          ))}
        </>
      )}

      {movie.ai_content?.pros_cons && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ background: COLORS.surf, borderRadius: 10, padding: 14 }}>
            <p className={pixelFont.className} style={{ fontSize: 10, color: "#5dcaa5", margin: "0 0 10px" }}>
              จุดเด่น
            </p>
            {movie.ai_content.pros_cons.pros.map((p, i) => (
              <p key={i} style={{ fontSize: 13, margin: "0 0 6px", lineHeight: 1.6 }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ background: COLORS.surf, borderRadius: 10, padding: 14 }}>
            <p className={pixelFont.className} style={{ fontSize: 10, color: "#f0997b", margin: "0 0 10px" }}>
              จุดสังเกต
            </p>
            {movie.ai_content.pros_cons.cons.map((c, i) => (
              <p key={i} style={{ fontSize: 13, margin: "0 0 6px", lineHeight: 1.6 }}>
                {c}
              </p>
            ))}
          </div>
        </div>
      )}

      {primaryProvider && (
        <div
          style={{
            background: COLORS.accent,
            borderRadius: 10,
            padding: 16,
            marginBottom: "1.25rem",
          }}
        >
          <p className={pixelFont.className} style={{ fontSize: 11, color: "#412a06", margin: "0 0 8px" }}>
            ดูได้ที่ไหน
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#412a06" }}>
              สมาชิกรายเดือนของแพลตฟอร์มนี้ดูได้ทันที
            </span>
            <Link
              href={`/platforms/${primaryProvider.slug}`}
              style={{
                background: "#fff",
                color: "#412a06",
                fontSize: 11,
                padding: "6px 14px",
                borderRadius: 5,
                textDecoration: "none",
              }}
            >
              ไปหน้า {primaryProvider.name.toUpperCase()} →
            </Link>
          </div>
        </div>
      )}

      {movie.ai_content?.faq && movie.ai_content.faq.length > 0 && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            คำถามที่พบบ่อย
          </p>
          <div style={{ background: COLORS.surf, borderRadius: 10, padding: 14, marginBottom: "1.25rem" }}>
            {movie.ai_content.faq.map((f, i) => (
              <div key={i} style={{ marginBottom: i < movie.ai_content!.faq!.length - 1 ? 12 : 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 4px" }}>{f.question}</p>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {cast.length > 0 && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            นักแสดงนำ
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {cast.slice(0, 6).map((c, i) => (
              <span
                key={i}
                style={{
                  background: COLORS.surf,
                  color: COLORS.text,
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 20,
                }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </>
      )}

      {similar.length > 0 && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            หนังที่คล้ายกัน
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 10,
            }}
          >
            {similar.map((m: any) => (
              <Link
                key={m.slug}
                href={`/movies/${m.slug}`}
                style={{
                  background: "#e0608f",
                  borderRadius: 8,
                  padding: 10,
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 80,
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: 4,
                    marginBottom: 8,
                    overflow: "hidden",
                  }}
                >
                  {m.poster_path && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                      alt={m.title_th}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <p className={pixelFont.className} style={{ fontSize: 9, color: "#3d1428", margin: 0 }}>
                  {m.title_th}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}