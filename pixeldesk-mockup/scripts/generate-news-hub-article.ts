import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";
import { generateNewsHubArticle } from "../lib/hub-content";

async function main() {
  console.log("กำลังดึงหัวข้อข่าวล่าสุด...");
  const { data: news } = await supabase
    .from("articles")
    .select("title")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .order("created_at", { ascending: false })
    .limit(15);

  const titles = (news ?? []).map((n) => n.title);
  console.log("ใช้ " + titles.length + " หัวข้อเป็นข้อมูลอ้างอิง");

  console.log("กำลังเขียนบทความ...");
  const body = await generateNewsHubArticle(titles);

  const { error } = await supabase.from("hub_content").upsert(
    {
      key: "crypto-news-hub",
      title: "ข่าวคริปโตวันนี้ อัปเดตล่าสุด",
      body_th: body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    console.log("บันทึกไม่สำเร็จ: " + error.message);
  } else {
    console.log("บันทึกสำเร็จ");
  }
}

main().catch((err) => {
  console.log("เกิดข้อผิดพลาด: " + err.message);
  process.exit(1);
});