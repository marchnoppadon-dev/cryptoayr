import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 900-1100 คำ เรื่อง "Forex คืออะไร"
สำหรับหน้าหลักของหมวด Forex ในเว็บไซต์คริปโต/ฟอเร็กซ์

ครอบคลุม:
1. Forex คืออะไร ตลาดแลกเปลี่ยนเงินตราต่างประเทศทำงานอย่างไร
2. ต่างจากคริปโตอย่างไร (คู่เงิน vs เหรียญคริปโต, เวลาเปิดตลาด, การกำกับดูแล)
3. ทำไมคนถึงสนใจเทรด Forex (สภาพคล่องสูง, leverage, เปิดตลาด 24/5)
4. ภาพรวมสิ่งที่มือใหม่ควรรู้ก่อนเริ่ม (การเลือกโบรกเกอร์, MT5, ทดลองเทรด demo ก่อนเงินจริง)
5. ปิดท้ายด้วยการแนะนำว่าเว็บนี้มีเนื้อหาอะไรให้ศึกษาต่อบ้าง (บอทเทรด, ทดลองเทรดฟรี,
   Indicator ฟรี, คอร์สเรียนฟรี) แบบกล่าวถึงเฉยๆ ไม่ต้องใส่ลิงก์ในเนื้อหา

ห้ามให้คำแนะนำการลงทุนเฉพาะเจาะจง ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
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
    .upsert({ key: "forex-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ Forex หลักแล้ว");
  }
}

main();