import Link from "next/link";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../../../lib/supabase";

const display = Anton({ subsets: ["latin"], weight: "400" });
const thai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
});

export const revalidate = 60;

const COLORS = {
  bg: "#0b0b0d",
  surf: "#161618",
  border: "#2a2a2e",
  accent: "#e6283f",
  text: "#f2f0eb",
  muted: "#8f8f95",
};

async function getAllNews() {
  const { data } = await supabase
    .from("articles")
    .select("slug, title, source_name, created_at")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .in("status", ["ai_generated", "published"])
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export const metadata = {
  title: "ข่าวคริปโตล่าสุด | cryptoayr",
  description: "สรุปข่าวคริปโตภาษาไทยทุกวัน อัปเดตล่าสุดจากหลายแหล่งข่าว",
};

export default async function CryptoNewsListPage() {
  const news = await getAllNews();
  const { data: hubArticle } = await supabase
    .from("hub_content")
    .select("title, body_th")
    .eq("key", "crypto-news-hub")
    .maybeSingle();

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }} className={thai.className}>
      <style>{`
        .site-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid ${COLORS.border};
          gap: 12px;
          flex-wrap: wrap;
        }
        .nav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
          color: ${COLORS.muted};
          overflow-x: auto;
          white-space: nowrap;
        }
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 720px) {
          .site-nav { padding: 1rem 1.25rem; }
        }
      `}</style>

      <nav className="site-nav">
        <Link href="/" className={display.className} style={{ fontSize: 22, letterSpacing: 1, color: COLORS.text, textDecoration: "none" }}>
          CRYPTO<span style={{ color: COLORS.accent }}>AYR</span>
        </Link>
        <div className="nav-links">
          <Link href="/crypto/news" style={{ color: COLORS.text }}>ข่าว</Link>
          <span>Indicator</span>
          <span>วิธีเทรด</span>
          <span>บอทเทรด</span>
        </div>
        <span
          style={{
            border: "1px solid " + COLORS.accent,
            color: COLORS.accent,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          Forex →
        </span>
      </nav>

      <div style={{ padding: "2.5rem 2rem" }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / ข่าว Crypto
        </nav>

        <h1 className={display.className} style={{ fontSize: 32, margin: "0 0 8px" }}>
          ข่าวคริปโตล่าสุด
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: "0 0 32px" }}>
          {news.length} ข่าว อัปเดตล่าสุด
        </p>

        {news.length > 0 ? (
          <div className="news-grid">
            {news.map((n) => (
              <Link
                key={n.slug}
                href={"/crypto/news/" + n.slug}
                style={{
                  background: COLORS.surf,
                  border: "1px solid " + COLORS.border,
                  borderRadius: 10,
                  padding: 20,
                  textDecoration: "none",
                  color: COLORS.text,
                  display: "block",
                }}
              >
                <p style={{ fontSize: 12, color: COLORS.accent, margin: "0 0 10px" }}>
                  {n.source_name ?? "ข่าว"}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: "0 0 10px" }}>
                  {n.title}
                </p>
                <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
                  {new Date(n.created_at).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: COLORS.muted }}>ยังไม่มีข่าวในระบบ</p>
        )}

        {hubArticle && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid " + COLORS.border }}>
            <h2 className={display.className} style={{ fontSize: 20, margin: "0 0 16px" }}>
              {hubArticle.title}
            </h2>
            {hubArticle.body_th.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.8, color: COLORS.muted, margin: "0 0 1rem" }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}