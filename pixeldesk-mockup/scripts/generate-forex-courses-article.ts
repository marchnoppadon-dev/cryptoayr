import { config } from "dotenv";
config({ path: ".env.local" });

import { supabase } from "../lib/supabase";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPT = `เขียนบทความภาษาไทยยาวประมาณ 800-1000 คำ เรื่อง "เรียนเทรด Forex ฟรี สำหรับมือใหม่"
สำหรับหน้าเว็บที่รวมแนวทางการเรียนรู้เทรด Forex ตั้งแต่เริ่มต้น

แทรกคำเหล่านี้อย่างเป็นธรรมชาติ: "เรียนเทรดฟรี", "เรียนเทรดมือใหม่", "เริ่มต้นเทรด Forex"

ครอบคลุม:
1. พื้นฐานที่มือใหม่ต้องรู้ก่อนเทรด Forex (คำศัพท์สำคัญ เช่น Pip, Lot, Leverage, Spread, Margin)
2. วิธีอ่านกราฟแท่งเทียนเบื้องต้น
3. หลักการบริหารความเสี่ยง (Money Management) และ Risk-Reward Ratio
4. ลำดับการเรียนรู้ที่แนะนำ (เริ่มจากทฤษฎี -> ฝึกบัญชี Demo -> ค่อยเทรดบัญชีจริงด้วยเงินน้อย)
5. แหล่งเรียนรู้ฟรีที่มีอยู่ทั่วไป (คอร์สออนไลน์, YouTube, เอกสารจากโบรกเกอร์) โดยไม่ต้องระบุชื่อเจาะจง

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
    .upsert({ key: "forex-courses-hub", title, body_th: body }, { onConflict: "key" });

  if (error) {
    console.error("insert ล้มเหลว:", error.message);
  } else {
    console.log("สำเร็จ! บันทึกบทความ Forex Courses แล้ว");
  }
}

main();