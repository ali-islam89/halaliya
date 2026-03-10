import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("nameJa,nameEn")
      .eq("slug", slug)
      .eq("isActive", true)
      .single();
    if (!data) return { title: "Not Found" };
    const name = locale === "en" ? data.nameEn || data.nameJa : data.nameJa;
    return { title: name } satisfies Metadata;
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = createServiceClient();

  const { data: raw } = await supabase
    .from("products")
    .select("*, product_images(id,url,order), categories!categoryId(id,nameJa,nameTr,nameEn,slug,order)")
    .eq("slug", slug)
    .eq("isActive", true)
    .single();

  if (!raw) notFound();

  const product = {
    ...raw,
    images: (raw.product_images || []).sort((a: any, b: any) => a.order - b.order),
    category: raw.categories || null,
    reviews: [],
  };

  let related: any[] = [];
  if (raw.categoryId) {
    const { data: relRaw } = await supabase
      .from("products")
      .select("*, product_images(id,url,order), categories!categoryId(id,nameJa,nameTr,nameEn,slug,order)")
      .eq("categoryId", raw.categoryId)
      .eq("isActive", true)
      .neq("id", raw.id)
      .limit(4);
    related = (relRaw || []).map((p: any) => ({
      ...p,
      images: (p.product_images || []).sort((a: any, b: any) => a.order - b.order),
      category: p.categories || null,
    }));
  }

  return <ProductDetailClient product={product} related={related} locale={locale as Locale} />;
}
