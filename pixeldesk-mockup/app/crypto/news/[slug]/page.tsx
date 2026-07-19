import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import Nav from "../../../../components/Nav";

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

interface NewsDetail {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  long_content_th: string | null;
  faq: string | null;
  source_name: string | null;
  source_url: string | null;
  created_at: string;
}

async function getNews(slug: string): Promise<NewsDetail | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, meta_title, meta_description, long_content_th, faq, source_name, source_url, created_at"
    )
    .eq("slug", slug)
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as NewsDetail;
}

async function getRelatedNews(currentSlug: string) {
  const { data } = await supabase
    .from("articles")
    .select("slug, title, created_at")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "published")
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(5);

  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return {};

  return {
    title: news.meta_title ?? news.title,
    description: news.meta_description ?? undefined,
  };
}

export default async function CryptoNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) notFound();

  const related = await getRelatedNews(news.slug);
  const faqList: { question: string; answer: string }[] = news.faq
    ? JSON.parse(news.faq)
    : [];
  const publishedDate = new Date(news.created_at).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: news.created_at,
    articleBody: news.long_content_th ?? undefined,
    image: ["https://www.cryptoayr.com/cryptoayr-hero-banner.webp"],
    author: {
      "@type": "Organization",
      name: "cryptoayr",
      url: "https://www.cryptoayr.com",
    },
  };

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, padding: "1.5rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav active="news" />

      <nav style={{ fontSize: 12, color: COLORS.muted, marginBottom: "1.5rem", marginTop: "1.5rem" }}>
        <Link href="/" style={{ color: COLORS.muted }}>
          หน้าแรก
        </Link>{" "}
        /{" "}
        <Link href="/crypto/news" style={{ color: COLORS.muted }}>
          ข่าว Crypto
        </Link>
      </nav>

      <div
        style={{
          background: COLORS.surf,
          border: "1px solid " + COLORS.cardBorder,
          borderRadius: 10,
          padding: 18,
          marginBottom: "1.25rem",
        }}
      >
        <h1
          className={pixelFont.className}
          style={{ fontSize: 16, color: "#fff", margin: "0 0 10px", lineHeight: 1.6 }}
        >
          {news.title}
        </h1>
        <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
          {publishedDate}
          {news.source_name ? " · อ้างอิงจาก " + news.source_name : ""}
        </p>
      </div>

      {news.long_content_th && (
        <>
          {news.long_content_th.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.8, margin: "0 0 1rem" }}>
              {para}
            </p>
          ))}
        </>
      )}

      {news.source_url && (
        <div
          style={{
            background: COLORS.surf,
            borderRadius: 10,
            padding: 14,
            marginBottom: "1.25rem",
            fontSize: 12,
            color: COLORS.muted,
          }}
        >
          อ้างอิงข่าวต้นฉบับ:{" "}
          <a href={news.source_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{ color: COLORS.accent }}
          >
            {news.source_name ?? news.source_url}
          </a>
        </div>
      )}

      {faqList.length > 0 && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            คำถามที่พบบ่อย
          </p>
          <div style={{ background: COLORS.surf, borderRadius: 10, padding: 14, marginBottom: "1.25rem" }}>
            {faqList.map((f, i) => (
              <div key={i} style={{ marginBottom: i < faqList.length - 1 ? 12 : 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 4px" }}>{f.question}</p>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {related.length > 0 && (
        <>
          <p className={pixelFont.className} style={{ fontSize: 11, margin: "0 0 10px" }}>
            ข่าวอื่นที่น่าสนใจ
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {related.map((n) => (
              <Link
                key={n.slug}
                href={"/crypto/news/" + n.slug}
                style={{
                  background: COLORS.surf,
                  borderRadius: 8,
                  padding: 12,
                  textDecoration: "none",
                  color: COLORS.text,
                  fontSize: 13,
                }}
              >
                {n.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}