import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 800-1000 คำ สำหรับลงท้ายหน้าแรกของเว็บไซต์ cryptoayr
ซึ่งเป็นเว็บสรุปข่าวคริปโตภาษาไทย

แทรกคำเหล่านี้อย่างเป็นธรรมชาติ (ไม่ต้องยัดเยียด แต่ต้องมีครบ):
"ข่าวคริปโตวันนี้", "อัพเดทข่าววงการคริปโต"

ครอบคลุม:
1. ทำไมการติดตามข่าวคริปโตให้ทันทุกวันถึงสำคัญ (ตลาดเปิด 24/7 เคลื่อนไหวเร็ว)
2. ประเภทข่าวที่ควรติดตาม (ราคาเหรียญหลัก, นโยบายกำกับดูแล, การพัฒนาเทคโนโลยี,
   ความเคลื่อนไหวของนักลงทุนสถาบัน)
3. วิธีแยกแยะข่าวที่น่าเชื่อถือจากข่าวลือ/ข่าวปั่นราคา
4. บทบาทของ cryptoayr ในการสรุปข่าวให้อ่านง่ายและอ้างอิงแหล่งที่มาชัดเจน
5. แนะนำให้ผู้อ่านติดตามหมวดข่าว, Indicator, และเนื้อหา Forex ในเว็บนี้ต่อ (พูดถึงเฉยๆ
   ไม่ต้องใส่ลิงก์ในเนื้อหา)

ห้ามให้คำแนะนำการลงทุนเฉพาะเจาะจง ห้ามการันตีผลกำไร ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
ตอบเป็น 2 ส่วน ห้ามมีข้อความอื่น:
===TITLE===
(ชื่อบทความบรรทัดเดียว)
===BODY===
(เนื้อหาเต็ม แบ่งย่อหน้าด้วยบรรทัดว่าง)
===END===`;

async function main() {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: PROMPT }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error("Anthropic API error: " + response.status + " " + errText);
  }

  const data = await response.json();
  const fullText = data.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");

  const titleMatch = fullText.match(/===TITLE===([\s\S]*?)===BODY===/);
  const bodyMatch = fullText.match(/===BODY===([\s\S]*?)===END===/);

  if (!titleMatch || !bodyMatch) {
    console.log("RAW:", fullText);
    throw new Error("parse ไม่สำเร็จ");
  }

  const title = titleMatch[1].trim();
  const body = bodyMatch[1].trim();

  const { error } = await supabase
    .from("hub_content")
    .upsert({ key: "homepage-seo-article", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ SEO หน้าแรกแล้ว");
  }
}

main();