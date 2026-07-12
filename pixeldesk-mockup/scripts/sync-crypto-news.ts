import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";
import { fetchLatestNews } from "../lib/cryptocompare-news";
import { generateNewsSummary } from "../lib/news-content";

function slugify(id: string): string {
  return "crypto-news-" + id;
}

async function main() {
  console.log("กำลังดึงข่าว crypto จาก CryptoCompare...");
  const newsList = await fetchLatestNews("BTC,ETH,Trading");
  console.log("ดึงมาได้ " + newsList.length + " ข่าว");

  let created = 0;
  let skipped = 0;

  for (const news of newsList) {
    const slug = slugify(news.id);

    const existing = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing.data) {
      console.log("ข้าม (มีอยู่แล้ว): " + news.title);
      skipped++;
      continue;
    }

    console.log("กำลังสรุปข่าว: " + news.title);

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
        console.log("บันทึกไม่สำเร็จ: " + insertResult.error.message);
      } else {
        console.log("บันทึกสำเร็จ: " + slug);
        created++;
      }
    } catch (err) {
      console.log("สรุปข่าวไม่สำเร็จ: " + (err as Error).message);
    }
  }

  console.log("เสร็จสิ้น สร้างใหม่ " + created + " ข่าว ข้าม " + skipped + " ข่าว");
}

main().catch((err) => {
  console.log("เกิดข้อผิดพลาด: " + err.message);
  process.exit(1);
});