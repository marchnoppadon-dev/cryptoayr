import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../../../lib/admin-auth";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}