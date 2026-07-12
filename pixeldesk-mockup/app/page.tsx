import Link from "next/link";
import { Anton, IBM_Plex_Sans_Thai } from "next/font/google";
import { supabase } from "../lib/supabase";
import { fetchBitcoinPrice } from "../lib/coingecko";

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
  up: "#22c55e",
};

const COINS = ["BTC", "ETH", "SOL", "XRP", "BNB", "DOGE", "ADA", "AVAX", "LINK", "TON"];

const FEATURES = [
  {
    title: "เร็วทันตลาด",
    desc: "อัปเดตข่าวคริปโตทุกวัน ไม่พลาดความเคลื่อนไหวสำคัญ",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="#e6283f" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "อ้างอิงได้จริง",
    desc: "ทุกข่าวมีลิงก์กลับต้นฉบับ ตรวจสอบแหล่งที่มาได้เสมอ",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5" stroke="#e6283f" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5" stroke="#e6283f" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "ไม่ชี้นำการลงทุน",
    desc: "นำเสนอเชิงข้อมูล ไม่ใช่คำแนะนำซื้อ-ขาย",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M5 8l-3 6a4 4 0 008 0l-3-6M19 8l-3 6a4 4 0 008 0l-3-6M5 8h14M12 3l7 5H5l7-5z" stroke="#e6283f" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "อ่านง่ายเข้าใจไว",
    desc: "สรุปเป็นภาษาไทยธรรมชาติ ไม่ต้องแปลเอง",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h9a3 3 0 013 3v11a2 2 0 00-2-2H4V5zM20 5h-9a3 3 0 00-3 3" stroke="#e6283f" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
];

async function getBitcoin() {
  try {
    return await fetchBitcoinPrice();
  } catch {
    return null;
  }
}

async function getLatestNews() {
  const { data } = await supabase
    .from("articles")
    .select("slug, title, meta_description, source_name, created_at")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

function NewsThumb({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 140,
        background: "linear-gradient(135deg, #2a1015, #161618)",
        borderRadius: "10px 10px 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: COLORS.accent, fontSize: 13, letterSpacing: 2 }}>CRYPTOAYR</span>
    </div>
  );
}

export default async function HomePage() {
  const [btc, news, homepageArticle] = await Promise.all([
    getBitcoin(),
    getLatestNews(),
    supabase
      .from("hub_content")
      .select("title, body_th")
      .eq("key", "homepage-seo-article")
      .maybeSingle()
      .then((res) => res.data),
  ]);
  const featured = news.slice(0, 3);
  const rest = news.slice(3, 6);
  const tickerRow = [...COINS, ...COINS];

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text }} className={thai.className}>
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.nav-links::-webkit-scrollbar {
  display: none;
}
        .nav-links a, .nav-links span {
          white-space: nowrap;
        }
        @media (max-width: 720px) {
          .site-nav {
            padding: 1rem 1.25rem;
          }
        }
        .ticker-track {
          display: flex;
          gap: 48px;
          width: max-content;
          animation: ticker-scroll 28s linear infinite;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .feature-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="site-nav">
        <span className={display.className} style={{ fontSize: 22, letterSpacing: 1 }}>
          CRYPTO<span style={{ color: COLORS.accent }}>AYR</span>
        </span>
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

      <section
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid " + COLORS.border,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cryptoayr-hero-banner.webp"
          alt="CRYPTOAYR ข่าวคริปโตภาษาไทย รูปปั้นหินอ่อนโรมันผสานเทคโนโลยี สื่อถึงภูมิปัญญาโบราณที่เชื่อมกับตลาดคริปโตยุคใหม่"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(11,11,13,0.95) 0%, rgba(11,11,13,0.75) 35%, rgba(11,11,13,0.15) 65%, rgba(11,11,13,0.05) 100%)",
          }}
        />
        <div style={{ position: "relative", padding: "3rem 2rem", maxWidth: 720 }}>
          <p style={{ color: COLORS.accent, fontSize: 13, letterSpacing: 2, margin: "0 0 12px" }}>
            ข่าวคริปโตภาษาไทย
          </p>
          <h1
            className={display.className}
            style={{ fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 1.05, margin: "0 0 14px" }}
          >
            ตลาด<span style={{ color: COLORS.accent }}>ขยับ</span><br />
            คุณต้อง<span style={{ color: COLORS.accent }}>รู้ก่อน</span>
          </h1>
          <p
            className={display.className}
            style={{
              fontSize: "clamp(12px, 1.4vw, 15px)",
              color: COLORS.muted,
              letterSpacing: 1,
              margin: "0 0 24px",
            }}
          >
            CARVED IN MARBLE. CODED FOR TOMORROW.
          </p>
          <p style={{ fontSize: 16, color: COLORS.muted, maxWidth: 440, lineHeight: 1.7, margin: "0 0 28px" }}>
            สรุปข่าวคริปโตทุกวัน วิเคราะห์ตรงประเด็น อ่านง่าย ไม่ต้องงมหาเอง
          </p>

          <div
            style={{
              background: "rgba(22,22,24,0.85)",
              backdropFilter: "blur(6px)",
              border: "1px solid " + COLORS.border,
              borderRadius: 12,
              padding: "1.25rem 1.5rem",
              display: "inline-block",
            }}
          >
            <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 6px" }}>BTC / USD</p>
            {btc ? (
              <>
                <p className={display.className} style={{ fontSize: 32, margin: "0 0 4px" }}>
                  ${btc.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: btc.change24h >= 0 ? COLORS.up : COLORS.accent,
                    margin: 0,
                  }}
                >
                  {btc.change24h >= 0 ? "▲" : "▼"} {Math.abs(btc.change24h).toFixed(2)}% ใน 24 ชม.
                </p>
              </>
            ) : (
              <p style={{ color: COLORS.muted, fontSize: 13 }}>ราคาปัจจุบันไม่พร้อมใช้งานตอนนี้</p>
            )}
            <p style={{ fontSize: 10, color: COLORS.muted, marginTop: 10 }}>
              Data provided by{" "}
              <a href="https://www.coingecko.com/en/api" style={{ color: COLORS.muted }}>
                CoinGecko
              </a>
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          borderBottom: "1px solid " + COLORS.border,
          background: "linear-gradient(120deg, #1a0507, #0b0b0d 65%)",
          padding: "2.5rem 0",
          overflow: "hidden",
        }}
      >
        <p
          className={display.className}
          style={{
            textAlign: "center",
            fontSize: "clamp(22px, 4vw, 34px)",
            margin: "0 0 28px",
            padding: "0 1rem",
          }}
        >
          ตลาดไม่เคยหยุด <span style={{ color: COLORS.accent }}>ข่าวก็ไม่ควรช้า</span>
        </p>
        <div className="ticker-track">
          {tickerRow.map((coin, i) => (
            <span
              key={i}
              className={display.className}
              style={{ fontSize: 20, color: COLORS.muted, letterSpacing: 1 }}
            >
              {coin} <span style={{ color: COLORS.accent }}>·</span>
            </span>
          ))}
        </div>
      </section>

      <section style={{ padding: "3rem 2rem" }}>
        <p className={display.className} style={{ fontSize: 20, letterSpacing: 1, marginBottom: 20 }}>
          ทำไมต้องอ่านข่าวกับ CRYPTOAYR
        </p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: COLORS.surf,
                border: "1px solid " + COLORS.border,
                borderRadius: 10,
                padding: 20,
              }}
            >
              <div style={{ marginBottom: 12 }}>{f.icon}</div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{f.title}</p>
              <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "1rem 2rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <p className={display.className} style={{ fontSize: 20, letterSpacing: 1 }}>
            ข่าวล่าสุด
          </p>
          <Link href="/crypto/news" style={{ color: COLORS.accent, fontSize: 14 }}>
            ดูทั้งหมด →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {featured.map((n) => (
            <Link
              key={n.slug}
              href={"/crypto/news/" + n.slug}
              style={{
                background: COLORS.surf,
                border: "1px solid " + COLORS.border,
                borderRadius: 10,
                textDecoration: "none",
                color: COLORS.text,
                display: "block",
                overflow: "hidden",
              }}
            >
              <NewsThumb title={n.title} />
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 12, color: COLORS.accent, margin: "0 0 10px" }}>
                  {n.source_name ?? "ข่าว"}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                  {n.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {rest.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rest.map((n) => (
              <Link
                key={n.slug}
                href={"/crypto/news/" + n.slug}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: COLORS.surf,
                  borderRadius: 8,
                  textDecoration: "none",
                  color: COLORS.text,
                  fontSize: 14,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span>{n.title}</span>
                <span style={{ color: COLORS.muted }}>{n.source_name}</span>
              </Link>
            ))}
          </div>
        )}

        {news.length === 0 && (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            ยังไม่มีข่าวในระบบ รอ sync รอบถัดไป
          </p>
        )}
      </section>

      {homepageArticle && (
        <section
          style={{
            padding: "3rem 2rem 4rem",
            borderTop: "1px solid " + COLORS.border,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          <h2 className={display.className} style={{ fontSize: 22, margin: "0 0 20px" }}>
            {homepageArticle.title}
          </h2>
          {homepageArticle.body_th.split("\n\n").map((para: string, i: number) => (
            <p
              key={i}
              style={{ fontSize: 14, lineHeight: 1.8, color: COLORS.muted, margin: "0 0 1.1rem" }}
            >
              {para}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}