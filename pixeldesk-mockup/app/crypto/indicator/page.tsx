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

async function getAllIndicators() {
  const { data } = await supabase
    .from("articles")
    .select("slug, title, meta_description")
    .eq("vertical", "crypto")
    .eq("pillar", "indicators")
    .in("status", ["ai_generated", "published"])
    .order("title", { ascending: true });
  return data ?? [];
}

export const metadata = {
  title: "รีวิว Indicator เทรดคริปโต | cryptoayr",
  description: "รวมรีวิว Indicator ยอดนิยมสำหรับเทรดคริปโตเคอเรนซี อ่านค่า ใช้งาน และเหมาะกับสไตล์เทรดแบบไหน",
};

export default async function IndicatorListPage() {
  const indicators = await getAllIndicators();

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
          flex-wrap: wrap;
        }
        .indicator-grid {
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
          <Link href="/crypto/news" style={{ color: COLORS.muted, textDecoration: "none" }}>ข่าว</Link>
          <Link href="/crypto/indicator" style={{ color: COLORS.text, textDecoration: "none" }}>Indicator</Link>
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
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / Indicator
        </nav>

        <h1 className={display.className} style={{ fontSize: 32, margin: "0 0 8px" }}>
          รีวิว Indicator เทรดคริปโต
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 14, margin: "0 0 32px" }}>
          {indicators.length} indicator ที่ควรรู้จักก่อนเทรด
        </p>

        {indicators.length > 0 ? (
          <div className="indicator-grid">
            {indicators.map((ind) => (
              <Link
                key={ind.slug}
                href={"/crypto/indicator/" + ind.slug}
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
                <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: "0 0 10px" }}>
                  {ind.title}
                </p>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                  {ind.meta_description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: COLORS.muted }}>ยังไม่มี indicator ในระบบ</p>
        )}
      </div>
    </div>
  );
}