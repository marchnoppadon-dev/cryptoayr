import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 800-1000 คำ เรื่อง "Indicator Forex ฟรี วิธีติดตั้งใน MT5"
สำหรับหน้าเว็บที่แนะนำเรื่อง Indicator สำหรับเทรด Forex บนแพลตฟอร์ม MT5

แทรกคำนี้อย่างเป็นธรรมชาติ: "Indicator Forex ฟรี"

ครอบคลุม:
1. Indicator ใน MT5 คืออะไร ต่างจาก EA ยังไง (Indicator ช่วยวิเคราะห์ ไม่เปิดปิดออเดอร์เอง)
2. Indicator มาตรฐานที่ติดมากับ MT5 อยู่แล้ว เข้าถึงผ่านเมนู Insert > Indicators
3. วิธีติดตั้ง Indicator ฟรีที่โหลดมาเพิ่มเติม (วางไฟล์ในโฟลเดอร์ MQL5/Indicators
   ผ่านเมนู File > Open Data Folder แล้ว restart MT5 ถึงจะขึ้นในหมวด Custom)
4. คำแนะนำสำคัญ: ไม่ควรใช้ indicator เกิน 2-3 ตัวพร้อมกันในกราฟเดียว
   เพราะจะทำให้สัญญาณสับสนและตีความยาก
5. Indicator ยอดนิยมที่มือใหม่ควรรู้จัก (Moving Average, RSI, MACD) แบบพูดถึงสั้นๆ
   ไม่ต้องลงรายละเอียดลึก เพราะมีบทความรีวิวแยกแล้ว

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
    .upsert({ key: "forex-indicator-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ Forex Indicator แล้ว");
  }
}

main();