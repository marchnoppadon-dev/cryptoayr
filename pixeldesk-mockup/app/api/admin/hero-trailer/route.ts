import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { supabase } from "../../../../lib/supabase";

function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const url: string = body?.url ?? "";

  const videoId = extractYoutubeId(url);
  if (!videoId) {
    return NextResponse.json(
      { error: "ไม่สามารถดึง video ID จากลิงก์นี้ได้ เช็คว่าวางลิงก์ YouTube ถูกต้องไหม" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ hero_trailer_url: videoId, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, videoId });
}