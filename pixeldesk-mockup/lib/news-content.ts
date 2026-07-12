import { config } from "dotenv";
config({ path: ".env.local" });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL = "claude-sonnet-4-6";

export interface NewsContext {
  titleEn: string;
  bodyEn: string;
  sourceName: string;
  sourceUrl: string;
  vertical: "crypto" | "forex";
}

export interface GeneratedNewsContent {
  metaTitle: string;
  metaDescription: string;
  articleBody: string;
  faq: { question: string; answer: string }[];
}

const NEWS_SYSTEM_PROMPT = `คุณเป็นนักข่าวสายการเงิน/คริปโตให้เว็บไซต์ cryptoayr
กฎที่ต้องทำตามเคร่งครัด:
1. ห้ามแปลเนื้อข่าวต้นฉบับแบบคำต่อคำหรือประโยคต่อประโยคเด็ดขาด เนื้อข่าวต้นฉบับ
   มีลิขสิทธิ์เป็นของสำนักข่าวต้นทาง ใช้เป็นข้อมูลอ้างอิงเพื่อเข้าใจเหตุการณ์เท่านั้น
   แล้วสรุปใจความสำคัญใหม่ทั้งหมดด้วยคำพูดและมุมมองของตัวเอง
2. ห้ามคัดลอกตัวเลขหรือสถิติเป็นชุดใหญ่ตรงๆ จากต้นฉบับ ให้หยิบเฉพาะตัวเลขสำคัญ
   ที่จำเป็นต่อความเข้าใจมาเล่าใหม่ในประโยคของตัวเอง
3. เขียนเป็นภาษาไทยธรรมชาติ ไม่ใช่ภาษาแปล ห้ามมีโครงสร้างประโยคแบบอังกฤษ
4. โครงบทความมีครบ 3 ส่วน เขียนเป็นเนื้อความต่อกัน ไม่ต้องมีหัวข้อย่อย:
   ก เปิดด้วยใจความสำคัญที่สุดของข่าว (what happened) แบบสรุปสั้น
   ข อธิบายบริบทหรือผลกระทบที่เกี่ยวข้อง (why it matters)
   ค ปิดท้ายด้วยมุมมองว่าเรื่องนี้ส่งผลอย่างไรกับนักลงทุน/นักเทรดทั่วไป
5. ห้ามให้คำแนะนำการลงทุนที่เจาะจง เช่น ควรซื้อ ควรขาย จะขึ้นแน่นอน ให้เขียนเชิง
   ข้อมูล/การศึกษาเท่านั้น
6. ความยาว 300-500 คำ ห้ามยืดประโยคซ้ำความหมายเดิมเพื่อให้ยาว
7. ตอบตามรูปแบบที่กำหนดเป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้เด็ดขาด:

===META===
{"metaTitle": "...", "metaDescription": "...", "faq": [{"question": "...", "answer": "..."}]}
===ARTICLE===
เนื้อข่าวสรุปเต็มเขียนตรงนี้เป็นข้อความธรรมดา ไม่ต้องอยู่ในรูปแบบ JSON ใส่เครื่องหมาย
คำพูดได้ตามปกติเพราะส่วนนี้ไม่ใช่ JSON
===END===

8. ส่วน META ต้องเป็น JSON ที่ valid จริง ห้ามใส่เครื่องหมายคำพูดคู่ในเนื้อหาของ
   metaTitle metaDescription และ faq เด็ดขาด เพราะส่วนนี้ parse แบบ JSON จริง`;

function buildNewsPrompt(ctx: NewsContext): string {
  return "ข้อมูลข่าวต้นฉบับ (ห้ามแปลตรง ใช้แค่เข้าใจเหตุการณ์):\n" +
    "หัวข้อ (อังกฤษ): " + ctx.titleEn + "\n" +
    "เนื้อข่าว (อังกฤษ อ้างอิงเท่านั้น): " + ctx.bodyEn + "\n" +
    "แหล่งข่าว: " + ctx.sourceName + "\n" +
    "ประเภท: " + (ctx.vertical === "crypto" ? "คริปโตเคอเรนซี" : "ฟอเร็กซ์") + "\n\n" +
    "เขียนตามรูปแบบ ===META=== ===ARTICLE=== ===END=== ที่กำหนดไว้ในระบบ " +
    "สรุปข่าวยาว 300-500 คำ ครอบคลุมครบ 3 ส่วนตามกฎข้อ 4";
}

export async function generateNewsSummary(
  ctx: NewsContext
): Promise<GeneratedNewsContent> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: NEWS_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildNewsPrompt(ctx) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Claude API error: " + res.status + " " + errText);
  }

  const data = await res.json();
  const textBlock = data.content.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("ไม่มี text block ในผลลัพธ์จาก Claude API");

  const fullText = textBlock.text;

  const metaMatch = fullText.match(/===META===([\s\S]*?)===ARTICLE===/);
  const articleMatch = fullText.match(/===ARTICLE===([\s\S]*?)===END===/);

  if (!metaMatch || !articleMatch) {
    throw new Error("หาส่วน META หรือ ARTICLE ไม่เจอในคำตอบของ Claude");
  }

  let metaParsed: any;
  try {
    metaParsed = JSON.parse(metaMatch[1].trim());
  } catch (err) {
    throw new Error("Parse JSON ส่วน META ไม่สำเร็จ: " + (err as Error).message + " | เนื้อหา: " + metaMatch[1].trim());
  }

  return {
    metaTitle: metaParsed.metaTitle,
    metaDescription: metaParsed.metaDescription,
    articleBody: articleMatch[1].trim(),
    faq: metaParsed.faq,
  };
}