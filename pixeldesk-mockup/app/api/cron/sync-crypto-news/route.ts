import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { fetchLatestNews } from "../../../../lib/cryptocompare-news";
import { generateNewsSummary } from "../../../../lib/news-content";

export const maxDuration = 300;

function slugify(id: string): string {
  return "crypto-news-" + id;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = "Bearer " + process.env.CRON_SECRET;

  if (authHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const newsList = await fetchLatestNews("BTC,ETH,Trading");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const news of newsList) {
    const slug = slugify(news.id);

    const existing = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing.data) {
      skipped++;
      continue;
    }

    try {
      const generated = await generateNewsSummary({
        titleEn: news.title,
        bodyEn: news.body,
        sourceName: news.source,
        sourceUrl: news.url,
        vertical: "crypto",
      });

      const insertResult = await supabase.from("articles").insert({
        vertical: "crypto",
        pillar: "news",
        slug: slug,
        title: generated.metaTitle,
        meta_title: generated.metaTitle,
        meta_description: generated.metaDescription,
        long_content_th: generated.articleBody,
        faq: JSON.stringify(generated.faq),
        source_name: news.source,
        source_url: news.url,
        image_url: news.imageUrl,
        status: "ai_generated",
      });

      if (insertResult.error) {
        failed++;
      } else {
        created++;
      }
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ created, skipped, failed, total: newsList.length });
}