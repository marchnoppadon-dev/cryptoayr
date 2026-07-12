import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../../lib/admin-auth";
import { supabase } from "../../../../../lib/supabase";

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const ids: string[] = body.ids ?? [];
  if (ids.length === 0) return NextResponse.json({ error: "no ids" }, { status: 400 });

  const { error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: new Date().toISOString() })
    .in("id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, publishedIds: ids });
}