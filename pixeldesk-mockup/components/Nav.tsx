"use client";

import Link from "next/link";
import { useState } from "react";
import { Anton } from "next/font/google";

const display = Anton({ subsets: ["latin"], weight: "400" });

const COLORS = {
  bg: "#0b0b0d",
  surf: "#161618",
  border: "#2a2a2e",
  accent: "#e6283f",
  text: "#f2f0eb",
  muted: "#8f8f95",
};

const FOREX_LINKS = [
  { href: "/forex", label: "Forex คืออะไร" },
  { href: "/forex/bots", label: "บอทเทรด Forex" },
  { href: "/forex/demo", label: "ทดลองเทรดฟรี" },
  { href: "/forex/indicator", label: "Indicator Forex ฟรี" },
  { href: "/forex/courses", label: "เรียนเทรดฟรี" },
];

export default function Nav({ active }: { active?: string }) {
  const [forexOpen, setForexOpen] = useState(false);

  function linkColor(key: string) {
    return active === key ? COLORS.text : COLORS.muted;
  }

  return (
    <>
      <style>{`
        .site-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid ${COLORS.border};
          gap: 12px;
          flex-wrap: wrap;
          position: relative;
        }
        .nav-links {
          display: flex;
          gap: 24px;
          font-size: 14px;
          flex-wrap: wrap;
          align-items: center;
        }
        .forex-dropdown {
          position: relative;
        }
        .forex-menu {
          position: absolute;
          top: 100%;
          right: 0;
          padding-top: 10px;
          z-index: 20;
        }
        .forex-menu-inner {
          background: ${COLORS.surf};
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          min-width: 220px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .forex-menu a {
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 13px;
          text-decoration: none;
          color: ${COLORS.text};
        }
        .forex-menu a:hover {
          background: ${COLORS.bg};
        }
        @media (max-width: 720px) {
          .site-nav { padding: 1rem 1.25rem; }
        }
      `}</style>

      <nav className="site-nav">
        <Link
          href="/"
          className={display.className}
          style={{ fontSize: 22, letterSpacing: 1, color: COLORS.text, textDecoration: "none" }}
        >
          CRYPTO<span style={{ color: COLORS.accent }}>AYR</span>
        </Link>

        <div className="nav-links">
          <Link href="/crypto/news" style={{ color: linkColor("news"), textDecoration: "none" }}>ข่าว</Link>
          <Link href="/crypto/indicator" style={{ color: linkColor("indicator"), textDecoration: "none" }}>Indicator</Link>
          <Link href="/crypto/how-to-trade" style={{ color: linkColor("how-to-trade"), textDecoration: "none" }}>วิธีเทรด</Link>
          <Link href="/crypto/bots" style={{ color: linkColor("bots"), textDecoration: "none" }}>บอทเทรด</Link>
        </div>

        <div
          className="forex-dropdown"
          onMouseEnter={() => setForexOpen(true)}
          onMouseLeave={() => setForexOpen(false)}
        >
          <button
            onClick={() => setForexOpen((v) => !v)}
            style={{
              border: "1px solid " + COLORS.accent,
              background: "transparent",
              color: COLORS.accent,
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Forex {forexOpen ? "▲" : "▼"}
          </button>

          {forexOpen && (
            <div className="forex-menu">
              <div className="forex-menu-inner">
                {FOREX_LINKS.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}