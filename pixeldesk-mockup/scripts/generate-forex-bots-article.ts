import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 800-1000 คำ เรื่อง "บอทเทรด Forex (EA) คืออะไร"
สำหรับหน้าเว็บที่แนะนำเรื่องบอทเทรดอัตโนมัติในตลาด Forex

ครอบคลุม:
1. EA (Expert Advisor) คืออะไร เรียกอีกชื่อว่าบอทเทรด/โรบอทเทรด ทำงานอย่างไร
2. ทำงานบน MT4/MT5 (เขียนด้วย MQL4/MQL5) ต้องติดตั้งลงบนแพลตฟอร์มก่อนใช้
3. ทำไมต้องใช้คู่กับ VPS (Virtual Private Server) เพื่อให้ EA ทำงานได้ตลอด 24 ชม.
   ไม่สะดุดเมื่อคอมดับหรือเน็ตหลุด
4. ข้อดี: ทำงานไม่มีอารมณ์ เฝ้าตลาดได้ 24/5 แทนคน
5. ข้อควรระวัง: ไม่ใช่ทุกโบรกเกอร์อนุญาตให้ใช้ EA, EA ที่ดีในอดีตไม่ได้การันตีอนาคต,
   ต้องเข้าใจกลยุทธ์ที่ EA ใช้ก่อนนำไปใช้จริงเสมอ ไม่ควรใช้แบบไม่รู้ที่มา
6. สิ่งที่ควรเช็คก่อนเลือกใช้ EA (มี Stop Loss ไหม, เคย drawdown เท่าไหร่, เหมาะกับสภาวะตลาดแบบไหน)

ห้ามแนะนำ EA เจาะจงยี่ห้อใดยี่ห้อหนึ่ง ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
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
    .upsert({ key: "forex-bots-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ Forex Bots แล้ว");
  }
}

main();