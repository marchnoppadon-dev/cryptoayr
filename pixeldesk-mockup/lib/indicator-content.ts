import { config } from "dotenv";
config({ path: ".env.local" });

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export type IndicatorMeta = {
  metaTitle: string;
  metaDescription: string;
  pros: string[];
  cons: string[];
  faq: { question: string; answer: string }[];
};

export type IndicatorContent = {
  meta: IndicatorMeta;
  reviewBody: string;
};

function buildPrompt(name: string): string {
  let p = "";
  p += "คุณคือนักเขียนคอนเทนต์ SEO ภาษาไทยที่เชี่ยวชาญเรื่อง technical indicator ";
  p += "สำหรับการเทรดคริปโตเคอเรนซี เขียนบทความรีวิว indicator ชื่อ \"" + name + "\" ";
  p += "ให้ครอบคลุมหัวข้อต่อไปนี้ (เขียนเป็นภาษาไทยธรรมชาติ ไม่แปลตรงจากภาษาอังกฤษ):\n\n";
  p += "1. indicator นี้คืออะไร ทำงานอย่างไร (อธิบายแบบเข้าใจง่ายสำหรับมือใหม่)\n";
  p += "2. วิธีอ่านค่า/สัญญาณจาก indicator นี้\n";
  p += "3. วิธีใช้กับการเทรดคริปโตโดยเฉพาะ (ตัวอย่างสถานการณ์จริง)\n";
  p += "4. ข้อดีของ indicator นี้\n";
  p += "5. ข้อจำกัด/จุดที่ต้องระวัง\n";
  p += "6. เหมาะกับสไตล์การเทรดแบบไหน (เทรดสั้น/เทรดยาว/scalping ฯลฯ)\n\n";
  p += "ห้ามให้คำแนะนำการลงทุนเฉพาะเจาะจง ห้ามการันตีผลกำไร ให้เขียนเชิงความรู้/การศึกษาเท่านั้น\n\n";
  p += "ตอบกลับมาในรูปแบบนี้เป๊ะๆ ห้ามมีข้อความอื่นนอกเหนือจากนี้:\n\n";
  p += "===META===\n";
  p += "{\"metaTitle\": \"...\", \"metaDescription\": \"...\", \"pros\": [\"...\"], \"cons\": [\"...\"], ";
  p += "\"faq\": [{\"question\": \"...\", \"answer\": \"...\"}]}\n";
  p += "===REVIEW===\n";
  p += "(เนื้อหาบทความเต็มตรงนี้ เป็น plain text ธรรมดา แบ่งย่อหน้าด้วยบรรทัดว่าง ";
  p += "ไม่ต้องใส่ markdown header ไม่ต้อง escape เครื่องหมายคำพูดใดๆ)\n";
  p += "===END===";
  return p;
}

export async function generateIndicatorContent(name: string): Promise<IndicatorContent> {
  const prompt = buildPrompt(name);

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
    .filter((block: any) => block.type === "text")
    .map((block: any) => block.text)
    .join("");

  const metaMatch = fullText.match(/===META===([\s\S]*?)===REVIEW===/);
  const reviewMatch = fullText.match(/===REVIEW===([\s\S]*?)===END===/);

  if (!metaMatch || !reviewMatch) {
    throw new Error("ไม่สามารถ parse ผลลัพธ์จาก AI ได้ (ไม่พบ META/REVIEW delimiter) สำหรับ: " + name);
  }

  let meta: IndicatorMeta;
  try {
    meta = JSON.parse(metaMatch[1].trim());
  } catch (e) {
    throw new Error("JSON.parse ล้มเหลวสำหรับ META ของ: " + name);
  }

  const reviewBody = reviewMatch[1].trim();

  return { meta, reviewBody };
}