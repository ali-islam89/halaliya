import { createServiceClient } from "@/lib/supabase/server";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import type { Locale } from "@/types";

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let categories: { id: string; nameJa: string; slug: string }[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("categories")
      .select("id,nameJa,slug")
      .is("parentId", null)
      .order("order")
      .limit(12);
    categories = data || [];
  } catch {}

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
