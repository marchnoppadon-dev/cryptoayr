import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";
import { generateHomepageArticle } from "../lib/homepage-article";

async function main() {
  console.log("กำลังเขียนบทความหน้าแรก...");
  const body = await generateHomepageArticle();

  const { error } = await supabase.from("hub_content").upsert(
    {
      key: "homepage-seo-article",
      title: "บิทคอยน์คืออะไร คริปโตเคอเรนซีคืออะไร ฉบับเข้าใจง่ายสำหรับมือใหม่",
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