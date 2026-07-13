import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const ARTICLES = [
  {
    key: "how-to-trade-hub",
    prompt: `เขียนบทความภาษาไทยยาวประมาณ 700-900 คำ เรื่อง "วิธีเทรดคริปโตสำหรับมือใหม่"
ครอบคลุม: การเลือกกระดานเทรด (exchange), การเปิดบัญชีและยืนยันตัวตน (KYC),
วิธีฝากเงินเข้าบัญชี, การเลือกเหรียญเริ่มต้น (แนะนำเหรียญ market cap สูงสำหรับมือใหม่),
หลักการ Stop Loss และ Cut Loss เบื้องต้น, แนวคิด DCA (Dollar-Cost Averaging)
ห้ามให้คำแนะนำการลงทุนเฉพาะเจาะจง ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
ตอบเป็น 2 ส่วน ห้ามมีข้อความอื่น:
===TITLE===
(ชื่อบทความบรรทัดเดียว)
===BODY===
(เนื้อหาเต็ม แบ่งย่อหน้าด้วยบรรทัดว่าง)
===END===`,
  },
  {
    key: "bots-hub",
    prompt: `เขียนบทความภาษาไทยยาวประมาณ 700-900 คำ เรื่อง "บอทเทรดคริปโตคืออะไร ช่วยอะไรได้บ้าง"
ครอบคลุม: บอทเทรดคืออะไร ทำงานอย่างไร, ประโยชน์สำหรับคนไม่มีเวลาเฝ้าจอตลอด 24 ชม.,
ประเภทของบอทเทรด (grid bot, DCA bot, signal bot), ข้อควรระวังก่อนใช้บอท
(ไม่มีบอทไหนการันตีกำไร ต้องเข้าใจความเสี่ยงก่อนใช้), สิ่งที่ควรเช็คก่อนเลือกใช้บอทเทรด
ห้ามแนะนำบอทเจาะจงยี่ห้อใดยี่ห้อหนึ่ง ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
ตอบเป็น 2 ส่วน ห้ามมีข้อความอื่น:
===TITLE===
(ชื่อบทความบรรทัดเดียว)
===BODY===
(เนื้อหาเต็ม แบ่งย่อหน้าด้วยบรรทัดว่าง)
===END===`,
  },
];

async function generateOne(key: string, prompt: string) {
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
      messages: [{ role: "user", content: prompt }],
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
    console.log("RAW (" + key + "):", fullText);
    throw new Error("parse ไม่สำเร็จสำหรับ " + key);
  }

  const title = titleMatch[1].trim();
  const body = bodyMatch[1].trim();

  const { error } = await supabase
    .from("hub_content")
    .upsert({ key, title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลวสำหรับ " + key + ": " + error.message);
  } else {
    console.log("สำเร็จ: " + key);
  }
}

async function main() {
  for (const item of ARTICLES) {
    await generateOne(item.key, item.prompt);
  }
  console.log("เสร็จสิ้นทั้งหมด");
}

main();