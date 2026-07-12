import Link from "next/link";
import { notFound } from "next/navigation";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../../../../lib/supabase";

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

async function getIndicator(slug: string) {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("vertical", "crypto")
    .eq("pillar", "indicators")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getIndicator(params.slug);
  if (!item) return {};
  return {
    title: item.meta_title,
    description: item.meta_description,
  };
}

export default async function IndicatorDetailPage({ params }: { params: { slug: string } }) {
  const item = await getIndicator(params.slug);
  if (!item) notFound();

  let pros: string[] = [];
  let cons: string[] = [];
  let faq: { question: string; answer: string }[] = [];
  try { pros = JSON.parse(item.pros); } catch (e) {}
  try { cons = JSON.parse(item.cons); } catch (e) {}
  try { faq = JSON.parse(item.faq); } catch (e) {}

  const paragraphs = (item.long_content_th || "").split("\n\n");

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

      <div style={{ padding: "2.5rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> /{" "}
          <Link href="/crypto/indicator" style={{ color: COLORS.muted }}>Indicator</Link> / {item.title}
        </nav>

        <h1 className={display.className} style={{ fontSize: 28, margin: "0 0 24px", lineHeight: 1.3 }}>
          {item.title}
        </h1>

        <div style={{ fontSize: 15, lineHeight: 1.9 }}>
          {paragraphs.map((p: string, i: number) => (
            <p key={i} style={{ margin: "0 0 1.2rem", color: COLORS.text }}>{p}</p>
          ))}
        </div>

        {(pros.length > 0 || cons.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "2rem 0" }}>
            {pros.length > 0 && (
              <div style={{ background: COLORS.surf, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 20 }}>
                <p style={{ fontWeight: 700, margin: "0 0 12px", color: "#4ade80" }}>ข้อดี</p>
                <ul style={{ margin: 0, paddingLeft: 20, color: COLORS.muted, fontSize: 14, lineHeight: 1.8 }}>
                  {pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div style={{ background: COLORS.surf, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 20 }}>
                <p style={{ fontWeight: 700, margin: "0 0 12px", color: COLORS.accent }}>ข้อจำกัด</p>
                <ul style={{ margin: 0, paddingLeft: 20, color: COLORS.muted, fontSize: 14, lineHeight: 1.8 }}>
                  {cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {faq.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 className={display.className} style={{ fontSize: 20, margin: "0 0 16px" }}>คำถามที่พบบ่อย</h2>
            {faq.map((f, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 700, margin: "0 0 6px" }}>{f.question}</p>
                <p style={{ color: COLORS.muted, fontSize: 14, margin: 0, lineHeight: 1.7 }}>{f.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}