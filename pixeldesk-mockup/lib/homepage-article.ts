import { config } from "dotenv";
config({ path: ".env.local" });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL = "claude-sonnet-4-6";

const HOMEPAGE_SYSTEM_PROMPT = `คุณเป็นนักเขียนคอนเทนต์ SEO ให้เว็บไซต์ cryptoayr
หน้าที่คือเขียนบทความยาวสำหรับหน้าแรกของเว็บ เพื่อให้ติดอันดับการค้นหาคำว่า
บิทคอยน์คืออะไร และ คริปโตคืออะไร บน Google
กฎที่ต้องทำตามเคร่งครัด:
1. เขียนเป็นภาษาไทยธรรมชาติ แบ่งเป็น 5-6 ย่อหน้า แยกด้วยการขึ้นบรรทัดใหม่สองครั้ง
   ไม่ต้องมีหัวข้อย่อยหรือ markdown ใดๆ
2. ย่อหน้าที่ 1 ต้องมีคำว่า บิทคอยน์คืออะไร ปรากฏอยู่ อธิบายภาพรวมสั้นๆ
   ว่าคริปโตเคอเรนซีคืออะไรในเชิงเข้าใจง่ายสำหรับมือใหม่
3. ย่อหน้าที่ 2 อธิบายว่าบล็อกเชนทำงานอย่างไรแบบพื้นฐาน ไม่ต้องลึกเชิงเทคนิคเกินไป
4. ย่อหน้าที่ 3 พูดถึงความแตกต่างระหว่าง Bitcoin กับ Altcoin ทั่วไป
5. ย่อหน้าที่ 4 พูดถึงความเสี่ยงที่มือใหม่ควรรู้ก่อนเริ่มลงทุน (ความผันผวนสูง
   ไม่มีการรับประกันผลตอบแทน) โดยไม่ต้องให้คำแนะนำการลงทุนที่เจาะจง
6. ย่อหน้าที่ 5 ชวนให้ติดตามข่าวสารและความรู้เพิ่มเติมผ่านเว็บ cryptoayr
7. ความยาวรวม 500-700 คำ ห้ามยืดประโยคซ้ำความหมายเดิมเพื่อให้ยาว
8. ห้ามให้คำแนะนำการลงทุนที่เจาะจง เช่น ควรซื้อ ควรขาย จะขึ้นแน่นอน
9. ห้ามใส่เครื่องหมายคำพูดคู่ในคำตอบเด็ดขาด
10. ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามมีคำนำ ห้ามมีข้อความอื่นนอกเหนือจากบทความที่ขอ`;

export async function generateHomepageArticle(): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2500,
      system: HOMEPAGE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: "เขียนบทความตามกฎที่กำหนดไว้ในระบบ",
        },
      ],
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