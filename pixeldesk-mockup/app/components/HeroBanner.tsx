"use client";

import { useState } from "react";
import Link from "next/link";

type Movie = {
  slug: string;
  title_th: string;
  backdrop_path: string | null;
  vote_average: number | null;
  trailer_youtube_key: string | null;
  ai_content?: { meta_description?: string } | null;
  movie_genres?: any[];
};

type Props = {
  trending: Movie | null;
  popular: Movie | null;
  latest: Movie | null;
  heroTrailerOverride: string | null;
  colors: { bg: string; surf: string; accent: string; text: string; muted: string };
  pixelFontClassName: string;
};

export default function HeroBanner({ trending, popular, latest, heroTrailerOverride, colors, pixelFontClassName }: Props) {
  const [tab, setTab] = useState<"trending" | "popular" | "latest">("trending");

  const featured = tab === "trending" ? trending : tab === "popular" ? popular : latest;

  if (!featured) return null;

  const genreNames = featured.movie_genres
    ?.map((g: any) => g.genres?.name_th)
    .filter(Boolean)
    .join(" · ");

  const tabStyle = (key: string) => ({
    color: tab === key ? colors.accent : colors.muted,
    borderBottom: tab === key ? "2px solid " + colors.accent : "2px solid transparent",
    paddingBottom: 4,
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: 11,
    fontFamily: "inherit",
  });

  return (
    <div>
      <div
        style={{
          position: "relative",
          minHeight: 560,
          backgroundImage: featured.backdrop_path
            ? "linear-gradient(to top, rgba(28,19,32,1) 0%, rgba(28,19,32,0.3) 50%, rgba(28,19,32,0.1) 100%), url(https://image.tmdb.org/t/p/w1280" + featured.backdrop_path + ")"
            : undefined,
          backgroundColor: colors.surf,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem 2rem",
        }}
      >
        <div style={{ display: "flex", gap: 18 }}>
          <button onClick={() => setTab("trending")} style={tabStyle("trending")}>กำลังมาแรง</button>
          <button onClick={() => setTab("popular")} style={tabStyle("popular")}>ยอดนิยม</button>
          <button onClick={() => setTab("latest")} style={tabStyle("latest")}>เพิ่มล่าสุด</button>
        </div>

        <div style={{ maxWidth: 560 }}>
          <p className={pixelFontClassName} style={{ fontSize: 22, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
            {featured.title_th}
          </p>
          <p style={{ fontSize: 13, color: colors.muted, margin: "0 0 10px" }}>
            {genreNames || "ภาพยนตร์"}
            {featured.vote_average !== null ? "  ★ " + Number(featured.vote_average).toFixed(1) : ""}
          </p>
          {featured.ai_content?.meta_description && (
            <p style={{ fontSize: 14, color: colors.text, margin: "0 0 18px", lineHeight: 1.6, maxWidth: 480 }}>
              {featured.ai_content.meta_description}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {(heroTrailerOverride || featured.trailer_youtube_key) && (
              
                <a href={"#trailer-embed"}
                style={{ background: colors.accent, color: "#3d2b04", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}
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
    </div>
  );
}