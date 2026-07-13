import Link from "next/link";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../../../lib/supabase";
import Nav from "../../../components/Nav";

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
  title: "บอทเทรดคริปโตคืออะไร | cryptoayr",
  description: "ทำความรู้จักบอทเทรดคริปโต ทำงานอย่างไร ช่วยอะไรได้บ้าง และสิ่งที่ควรระวังก่อนใช้งาน",
};

async function getArticle() {
  const { data } = await supabase
    .from("hub_content")
    .select("title, body_th")
    .eq("key", "bots-hub")
    .maybeSingle();
  return data;
}

export default async function BotsPage() {
  const article = await getArticle();

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, minHeight: "100vh" }} className={thai.className}>
      <style>{`
        `}</style>

      <Nav active="bots" />

      <div style={{ padding: "2.5rem 2rem", maxWidth: 760, margin: "0 auto" }}>
        <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1rem" }}>
          <Link href="/" style={{ color: COLORS.muted }}>หน้าแรก</Link> / บอทเทรด
        </nav>

        {article ? (
          <>
            <h1 className={display.className} style={{ fontSize: 28, margin: "0 0 24px", lineHeight: 1.3 }}>
              {article.title}
            </h1>
            {article.body_th.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.9, margin: "0 0 1.2rem" }}>{para}</p>
            ))}

            {/* TODO: จุดใส่ affiliate link บอทเทรด - รอตัดสินใจ partner ก่อน */}
            <div style={{ background: COLORS.surf, border: "1px dashed " + COLORS.border, borderRadius: 10, padding: 24, marginTop: 32, textAlign: "center" }}>
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                (พื้นที่สำหรับลิงก์สมัครบอทเทรด affiliate — จะเพิ่มภายหลัง)
              </p>
            </div>
          </>
        ) : (
          <p style={{ color: COLORS.muted }}>ยังไม่มีบทความในระบบ</p>
        )}
      </div>
    </div>
  );
}