import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

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

async function getProviders() {
  const { data } = await supabase.from("providers").select("id, name, slug").order("name");
  return data ?? [];
}

export const metadata: Metadata = {
  title: "แพลตฟอร์มสตรีมมิ่งทั้งหมด",
  description: "เลือกแพลตฟอร์มสตรีมมิ่ง Netflix, HBO Max, Apple TV, Viu และอื่นๆ ดูว่ามีหนังเรื่องไหนน่าดูบ้าง",
};

export default async function PlatformsListPage() {
  const providers = await getProviders();

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
          <Link href="/" style={{ color: COLORS.text, textDecoration: "none" }}>หน้าแรก</Link>
        </nav>
      </div>

      <div style={{ padding: "2rem 1.5rem" }}>
        <p className={pixelFont.className} style={{ fontSize: 9, color: COLORS.accent, margin: "0 0 10px" }}>
          เลือกแพลตฟอร์ม
        </p>
        <h1 className={pixelFont.className} style={{ fontSize: 20, color: "#fff", margin: "0 0 12px", lineHeight: 1.5 }}>
          ดูหนังแพลตฟอร์มไหนดี
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "0 0 24px", maxWidth: 640 }}>
          รวมแพลตฟอร์มสตรีมมิ่งทั้งหมดที่เรารีวิว เลือกแพลตฟอร์มที่ใช้อยู่
          แล้วดูว่ามีหนังเรื่องไหนน่าดูบ้าง อัปเดตทุกวัน
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {providers.map((p) => (
            <Link
              key={p.slug}
              href={"/platforms/" + p.slug}
              style={{
                background: COLORS.surf,
                border: "1px solid " + COLORS.cardBorder,
                borderRadius: 8,
                padding: 20,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 80,
              }}
            >
              <span
                className={pixelFont.className}
                style={{ fontSize: 14, color: COLORS.text, textAlign: "center" }}
              >
                {p.name.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}