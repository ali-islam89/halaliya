import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const categorySlug = searchParams.get("category");
  const sort = searchParams.get("sort") || "new";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const take = Math.min(48, parseInt(searchParams.get("limit") || "24"));
  const skip = (page - 1) * take;

  try {
    const supabase = createServiceClient();

    let query = supabase
      .from("products")
      .select("*, product_images(id,url,order), categories!categoryId(id,nameJa,nameTr,nameEn,slug,order)", { count: "exact" })
      .eq("isActive", true);

    if (q) {
      query = query.or(`nameJa.ilike.%${q}%,nameTr.ilike.%${q}%,nameEn.ilike.%${q}%`);
    }

    if (categorySlug) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
      if (cat) query = query.eq("categoryId", cat.id);
    }

    if (sort === "price") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("createdAt", { ascending: false });

    const { data: rawProducts, count } = await query.range(skip, skip + take - 1);

    const products = (rawProducts || []).map((p: any) => ({
      ...p,
      images: (p.product_images || []).sort((a: any, b: any) => a.order - b.order),
      category: p.categories || null,
    }));

    return NextResponse.json({ products, total: count || 0, page, take });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
