import Link from "next/link";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../../../lib/supabase";

const display = Anton({ subsets: ["latin"], weight: "400" });
const thai = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "500", "700"] });

export const dynamic = "force-dynamic";

const COLORS = {
  bg: "#0b0b0d",
  surf: "#161618",
  border: "#2a2a2e",
  accent: "#e6283f",
  text: "#f2f0eb",
  muted: "#8f8f95",
};

export const metadata = {
  title: "วิธีเทรดคริปโตสำหรับมือใหม่ | cryptoayr",
  description: "สอนวิธีเทรดคริปโตตั้งแต่เริ่มต้น เลือกกระดานเทรด เปิดบัญชี ฝากเงิน และกลยุทธ์พื้นฐานสำหรับมือใหม่",
};

async function getArticle() {
  const { data } = await supabase
    .from("hub_content")
    .select("title, body_th")
    .eq("key", "how-to-trade-hub")
    .maybeSingle();
  return data;
}

export default async function HowToTradePage() {
  const article = await getArticle();

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }} className={thai.className}>
      <style>{`
        .site-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-bottom: 1px solid ${COLORS.border}; gap: 12px; flex-wrap: wrap; }
        .nav-links { display: flex; gap: 24px; font-size: 14px; color: ${COLORS.muted}; flex-wrap: wrap; }
        @media (max-width: 720px) { .site-nav { padding: 1rem 1.25rem; } }
      `}</style>

      <nav className="site-nav">
        <Link href="/" className={display.className} style={{ fontSize: 22, letterSpacing: 1, color: COLORS.text, textDecoration: "none" }}>
          CRYPTO<span style={{ color: COLORS.accent }}>AYR</span>
        </Link>
        <div className="nav-links">
          <Link href="/crypto/news" style={{ color: COLORS.muted, textDecoration: "none" }}>ข่าว</Link>
          <Link href="/crypto/indicator" style={{ color: COLORS.muted, textDecoration: "none" }}>Indicator</Link>
          <Link href="/crypto/how-to-trade" style={{ color: COLORS.text, textDecoration: "none" }}>วิธีเทรด</Link>
          <Link href="/crypto/bots" style={{ color: COLORS.muted, textDecoration: "none" }}>บอทเทรด</Link>
        </div>
        <span style={{ border: "1px solid " + COLORS.accent, color: COLORS.accent, fontSize: 13, padding: "8px 16px", borderRadius: 4, whiteSpace: "nowrap" }}>
          Forex →
        </span>
      </nav>

      <div style={{ padding: "2.5rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / วิธีเทรด
        </nav>

        {article ? (
          <>
            <h1 className={display.className} style={{ fontSize: 28, margin: "0 0 24px", lineHeight: 1.3 }}>
              {article.title}
            </h1>
            {article.body_th.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.9, margin: "0 0 1.2rem" }}>{para}</p>
            ))}
          </>
        ) : (
          <p style={{ color: COLORS.muted }}>ยังไม่มีบทความในระบบ</p>
        )}
      </div>
    </div>
  );
}