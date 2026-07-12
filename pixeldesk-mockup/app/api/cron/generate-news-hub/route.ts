import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { generateNewsHubArticle } from "../../../../lib/hub-content";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = "Bearer " + process.env.CRON_SECRET;

  if (authHeader !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: news } = await supabase
    .from("articles")
    .select("title")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(15);

  const titles = (news ?? []).map((n) => n.title);
  const body = await generateNewsHubArticle(titles);

  const { error } = await supabase.from("hub_content").upsert(
    {
      key: "crypto-news-hub",
      title: "ข่าวคริปโตวันนี้ อัปเดตล่าสุด",
      body_th: body,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, titlesUsed: titles.length });
}