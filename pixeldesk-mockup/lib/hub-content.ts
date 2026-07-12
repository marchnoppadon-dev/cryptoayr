import { config } from "dotenv";
config({ path: ".env.local" });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL = "claude-sonnet-4-6";

const HUB_SYSTEM_PROMPT = `คุณเป็นนักเขียนคอนเทนต์ SEO ให้เว็บไซต์ cryptoayr
หน้าที่คือเขียนบทความยาวสำหรับหน้ารวมข่าวคริปโต เพื่อให้ติดอันดับการค้นหาคำว่า
"ข่าวคริปโตวันนี้" บน Google
กฎที่ต้องทำตามเคร่งครัด:
1. เขียนเป็นภาษาไทยธรรมชาติ แบ่งเป็น 3-4 ย่อหน้า แยกด้วยการขึ้นบรรทัดใหม่สองครั้ง
   ไม่ต้องมีหัวข้อย่อยหรือ markdown ใดๆ
2. ย่อหน้าที่ 1 ต้องมีคำว่า ข่าวคริปโตวันนี้ ปรากฏอยู่ พูดถึงว่าทำไมการติดตาม
   ข่าวคริปโตรายวันถึงสำคัญกับนักลงทุน/นักเทรด
3. ย่อหน้าที่ 2-3 พูดถึงประเภทข่าวที่ครอบคลุมในหน้านี้ โดยอ้างอิงจากหัวข้อข่าว
   ตัวอย่างที่ได้รับเท่านั้น ห้ามแต่งหัวข้อข่าวที่ไม่ได้อยู่ในรายการ
4. ย่อหน้าสุดท้ายชวนให้เลื่อนดูข่าวด้านบน และแนะนำว่าเว็บนี้อัปเดตทุกวัน
5. ความยาวรวม 350-500 คำ ห้ามยืดประโยคซ้ำความหมายเดิมเพื่อให้ยาว
6. ห้ามให้คำแนะนำการลงทุนที่เจาะจง เช่น ควรซื้อ ควรขาย
7. ห้ามใส่เครื่องหมายคำพูดคู่ในคำตอบเด็ดขาด
8. ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามมีคำนำ ห้ามมีข้อความอื่นนอกเหนือจากบทความที่ขอ`;

function buildHubPrompt(titles: string[]): string {
  return "ตัวอย่างหัวข้อข่าวที่มีอยู่ตอนนี้:\n" + titles.join("\n") +
    "\n\nเขียนบทความ SEO ยาวตามกฎที่กำหนดไว้ในระบบ";
}

export async function generateNewsHubArticle(titles: string[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: HUB_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildHubPrompt(titles) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Claude API error: " + res.status + " " + errText);
  }

  const data = await res.json();
  const textBlock = data.content.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("ไม่มี text block ในผลลัพธ์จาก Claude API");

  return textBlock.text.trim();
}