import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    const [{ count: productCount }, { count: categoryCount }] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      status: "ok",
      db: "connected",
      products: productCount,
      categories: categoryCount,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      db: "failed",
      error: error?.message || String(error),
    }, { status: 500 });
  }
}
