import Link from "next/link";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../../lib/supabase";
import Nav from "../../components/Nav";

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
  title: "Forex คืออะไร | cryptoayr",
  description: "ทำความรู้จัก Forex ตลาดแลกเปลี่ยนเงินตราต่างประเทศ พร้อมไกด์เริ่มต้นสำหรับมือใหม่",
};

const SUB_PAGES = [
  { href: "/forex/bots", title: "บอทเทรด Forex", desc: "บอทช่วยเทรดอัตโนมัติสำหรับตลาด Forex" },
  { href: "/forex/demo", title: "ทดลองเทรดฟรี", desc: "เปิดบัญชี Demo ฝึกเทรดโดยไม่เสี่ยงเงินจริง" },
  { href: "/forex/indicator", title: "Indicator Forex ฟรี", desc: "รวม Indicator สำหรับ MT5 ที่น่าใช้" },
  { href: "/forex/courses", title: "เรียนเทรดฟรี", desc: "คอร์สเรียนเทรด Forex สำหรับมือใหม่" },
];

async function getArticle() {
  const { data } = await supabase
    .from("hub_content")
    .select("title, body_th")
    .eq("key", "forex-hub")
    .maybeSingle();
  return data;
}

export default async function ForexHomePage() {
  const article = await getArticle();

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }} className={thai.className}>
      <Nav />

      <div style={{ padding: "2.5rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / Forex
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

        <div style={{ marginTop: 40 }}>
          <h2 className={display.className} style={{ fontSize: 20, margin: "0 0 20px" }}>
            เนื้อหา Forex ที่เกี่ยวข้อง
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {SUB_PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
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
                <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>{p.title}</p>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}