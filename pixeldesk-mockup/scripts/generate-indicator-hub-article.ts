import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `คุณคือนักเขียนคอนเทนต์ SEO ภาษาไทยที่เชี่ยวชาญเรื่องการเทรดคริปโตเคอเรนซี
เขียนบทความยาวประมาณ 700-900 คำ เพื่อลงท้ายหน้ารวม Indicator ของเว็บไซต์
โดยต้องแทรกคำเหล่านี้อย่างเป็นธรรมชาติในเนื้อหา (ไม่ต้องยัดเยียด แต่ต้องมีครบ):
"indicator ทำกำไร", "indicator ฟรี", "indicator คริปโตไหนดี"

ประเด็นที่ต้องพูดถึง:
1. Indicator ตัวเดียวไม่การันตีกำไร ต้องใช้ร่วมกับ risk management และ indicator ประเภทอื่นเสมอ
2. TradingView บัญชีฟรีใช้ indicator ได้สูงสุด 3 ตัวต่อกราฟ เป็นข้อจำกัดที่นักเทรดมือใหม่มักเจอ
3. คำแนะนำการเลือก indicator คริปโตให้เหมาะกับสไตล์เทรด (เทรนด์ตามยาว vs จับจังหวะสั้น)
4. แนะนำให้อ่านรีวิว indicator แต่ละตัวในเว็บนี้เพื่อประกอบการตัดสินใจ

ห้ามให้คำแนะนำการลงทุนเฉพาะเจาะจง ห้ามการันตีผลกำไร เขียนเชิงความรู้เท่านั้น
ปิดท้ายด้วยประโยคเตือนความเสี่ยงสั้นๆ

ตอบกลับเป็น 2 ส่วน ห้ามมีข้อความอื่นนอกจากนี้:
===TITLE===
(ชื่อบทความสั้นๆ บรรทัดเดียว)
===BODY===
(เนื้อหาเต็ม แบ่งย่อหน้าด้วยบรรทัดว่าง ไม่ต้อง escape อะไร)
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
    throw new Error("parse ไม่สำเร็จ ดู RAW ด้านบน");
  }

  const title = titleMatch[1].trim();
  const body = bodyMatch[1].trim();

  const { error } = await supabase
    .from("hub_content")
    .upsert({ key: "indicator-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ hub สำหรับหน้า Indicator แล้ว");
  }
}

main();