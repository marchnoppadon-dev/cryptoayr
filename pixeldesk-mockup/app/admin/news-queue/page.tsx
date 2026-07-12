import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { supabase } from "../../../lib/supabase";
import NewsList from "./NewsList";

export const dynamic = "force-dynamic";

interface PendingNews {
  id: string;
  title: string;
  source_name: string | null;
  long_content_th: string | null;
  created_at: string;
}

async function getPendingNews(): Promise<PendingNews[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, source_name, long_content_th, created_at")
    .eq("vertical", "crypto")
    .eq("pillar", "news")
    .eq("status", "ai_generated")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ดึงรายการรอตรวจสอบไม่สำเร็จ:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function NewsQueuePage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const news = await getPendingNews();

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>ข่าวรอตรวจสอบก่อน publish</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        {news.length} ข่าว — ติ๊กเลือกหลายข่าวแล้วกด Publish ที่เลือกได้เลย
      </p>
      <NewsList news={news} />
    </div>
  );
}