import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 800-1000 คำ เรื่อง "ทดลองเทรด Forex ฟรี ด้วยบัญชี Demo"
สำหรับหน้าเว็บที่แนะนำการเปิดบัญชีทดลองเทรด Forex

ต้องแทรกคำเหล่านี้อย่างเป็นธรรมชาติ: "ทดลองเทรด Forex", "ทดลองเทรด Forex ฟรี", "เปิดบัญชี Demo Forex"

ครอบคลุม:
1. บัญชี Demo คืออะไร ต่างจากบัญชีจริงยังไง (ใช้เงินเสมือนจริง ไม่มีความเสี่ยงทางการเงิน)
2. ทำไมมือใหม่ควรเริ่มจากบัญชี Demo ก่อนเสมอ
3. สิ่งที่ควรฝึกในบัญชี Demo (การใช้แพลตฟอร์ม MT4/MT5, การตั้ง Stop Loss, การอ่านกราฟ)
4. ข้อจำกัดของบัญชี Demo (ไม่มีแรงกดดันทางจิตใจเหมือนเงินจริง ต้องระวังตอนย้ายไปเทรดจริง)
5. ขั้นตอนทั่วไปในการเปิดบัญชี Demo (สมัคร กรอกอีเมล ดาวน์โหลด MT4/MT5 ล็อกอิน)

ห้ามพูดถึงโบรกเกอร์เจาะจงยี่ห้อใดยี่ห้อหนึ่ง ปิดท้ายด้วยคำเตือนความเสี่ยงสั้นๆ
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
    .upsert({ key: "forex-demo-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ Forex Demo แล้ว");
  }
}

main();