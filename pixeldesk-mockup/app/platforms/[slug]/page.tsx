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

interface Provider {
  id: number;
  name: string;
  slug: string;
  description_th: string | null;
}

interface ProviderMovie {
  slug: string;
  title_th: string;
  poster_path: string | null;
  vote_average: number | null;
}

async function getProvider(slug: string): Promise<Provider | null> {
  const { data } = await supabase
    .from("providers")
    .select("id, name, slug, description_th")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

async function getAllProviders(): Promise<{ name: string; slug: string }[]> {
  const { data } = await supabase.from("providers").select("name, slug").order("name");
  return data ?? [];
}

async function getMoviesForProvider(providerId: number): Promise<ProviderMovie[]> {
  const { data } = await supabase
    .from("movie_providers")
    .select("movies(slug, title_th, poster_path, vote_average, status)")
    .eq("provider_id", providerId)
    .eq("is_active", true);

  return (data ?? [])
    .map((row: any) => row.movies)
    .filter((m: any) => m && m.status === "published");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return {};

  return {
    title: "แนะนำหนัง " + provider.name.toUpperCase() + " ดูอะไรดี",
    description:
      "แนะนำหนัง " + provider.name.toUpperCase() + " ดูอะไรดี รวมหนังใหม่บน " + provider.name.toUpperCase() + " พร้อมรีวิวภาษาไทย อัปเดตล่าสุด",
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) notFound();

  const movies = await getMoviesForProvider(provider.id);
  const allProviders = await getAllProviders();
  const otherProviders = allProviders.filter((p) => p.slug !== provider.slug);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem" }}>
        <Link
          href="/"
          className={pixelFont.className}
          style={{ fontSize: 13, color: "#fff", padding: "4px 10px", border: "3px solid #000", background: "#000", borderRadius: 3, textDecoration: "none" }}
        >
          PIXELDESK
        </Link>
        <nav style={{ display: "flex", gap: 18, fontSize: 13, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>
            หน้าแรก
          </Link>
        </nav>
      </div>

      <nav style={{ fontSize: 12, color: COLORS.muted, padding: "0 1.5rem", marginBottom: "0.5rem" }}>
        <Link href="/" style={{ color: COLORS.muted }}>
          หน้าแรก
        </Link>{" "}
        /{" "}
        <Link href="/platforms" style={{ color: COLORS.muted }}>
          แพลตฟอร์ม
        </Link>{" "}
        / {provider.name.toUpperCase()}
      </nav>

      <div
        style={{
          background: "linear-gradient(160deg, " + COLORS.surf + " 0%, " + COLORS.bg + " 75%)",
          padding: "2.5rem 1.5rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          borderBottom: "1px solid " + COLORS.cardBorder,
        }}
      >
        <p className={pixelFont.className} style={{ fontSize: 10, color: COLORS.accent, margin: "0 0 10px", letterSpacing: 2 }}>
          แพลตฟอร์มสตรีมมิ่ง
        </p>
        <h1 className={pixelFont.className} style={{ fontSize: 22, color: "#fff", margin: "0 0 10px", lineHeight: 1.5 }}>
          {provider.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 6px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          {movies.length > 0
            ? "รวมหนัง " + movies.length + " เรื่องที่ดูได้บน " + provider.name.toUpperCase()
            : "เร็วๆนี้ — กำลังรวบรวมหนังบนแพลตฟอร์มนี้"}
        </p>
        {provider.description_th && (
          <p style={{ fontSize: 14, color: COLORS.muted, margin: 0, lineHeight: 1.7, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {provider.description_th}
          </p>
        )}
      </div>

      <div style={{ padding: "0 1.5rem 3rem" }}>
        {movies.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            ยังไม่มีหนังที่รีวิวแล้วบนแพลตฟอร์มนี้ กลับมาเช็คใหม่เร็วๆนี้
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 10,
            }}
          >
            {movies.map((m) => (
              <Link
                key={m.slug}
                href={"/movies/" + m.slug}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    background: COLORS.surf,
                    border: "1px solid " + COLORS.cardBorder,
                    borderBottom: "none",
                    borderRadius: "6px 6px 0 0",
                    overflow: "hidden",
                  }}
                >
                  {m.poster_path && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={"https://image.tmdb.org/t/p/w300" + m.poster_path}
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
        )}

        {otherProviders.length > 0 && (
          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid " + COLORS.cardBorder }}>
            <p className={pixelFont.className} style={{ fontSize: 11, color: COLORS.text, margin: "0 0 12px" }}>
              ดูแพลตฟอร์มอื่น
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {otherProviders.map((p) => (
                <Link
                  key={p.slug}
                  href={"/platforms/" + p.slug}
                  style={{
                    background: COLORS.surf,
                    border: "1px solid " + COLORS.cardBorder,
                    color: COLORS.text,
                    fontSize: 12,
                    padding: "6px 14px",
                    borderRadius: 20,
                    textDecoration: "none",
                  }}
                >
                  {p.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}