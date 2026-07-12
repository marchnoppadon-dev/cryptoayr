import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";
import { generateIndicatorContent } from "../lib/indicator-content";

type IndicatorSeed = {
  slug: string;
  name: string;
};

const INDICATORS: IndicatorSeed[] = [
  { slug: "rsi", name: "RSI (Relative Strength Index)" },
  { slug: "macd", name: "MACD" },
  { slug: "bollinger-bands", name: "Bollinger Bands" },
  { slug: "moving-average", name: "Moving Average (EMA/SMA)" },
  { slug: "fibonacci-retracement", name: "Fibonacci Retracement" },
  { slug: "stochastic-rsi", name: "Stochastic RSI" },
  { slug: "ichimoku-cloud", name: "Ichimoku Cloud" },
  { slug: "volume-profile", name: "Volume Profile" },
];

async function seedOne(item: IndicatorSeed) {
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", item.slug)
    .maybeSingle();

  if (existing) {
    console.log("ข้าม (มีอยู่แล้ว): " + item.slug);
    return;
  }

  console.log("กำลังสร้าง: " + item.name + " ...");
  const content = await generateIndicatorContent(item.name);

  const { error } = await supabase.from("articles").insert({
    vertical: "crypto",
    pillar: "indicator",
    slug: item.slug,
    title: item.name,
    meta_title: content.meta.metaTitle,
    meta_description: content.meta.metaDescription,
    long_content_th: content.reviewBody,
    pros: JSON.stringify(content.meta.pros),
    cons: JSON.stringify(content.meta.cons),
    faq: JSON.stringify(content.meta.faq),
    status: "ai_generated",
  });

  if (error) {
    console.error("insert ล้มเหลวสำหรับ " + item.slug + ": " + error.message);
  } else {
    console.log("สำเร็จ: " + item.slug);
  }
}

async function main() {
  for (const item of INDICATORS) {
    try {
      await seedOne(item);
    } catch (e: any) {
      console.error("เกิดข้อผิดพลาดที่ " + item.slug + ": " + e.message);
    }
  }
  console.log("เสร็จสิ้นทั้งหมด");
}

main();