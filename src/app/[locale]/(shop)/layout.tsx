import { prisma } from "@/lib/prisma";
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

  // カテゴリをDBから取得（エラー時は空配列）
  let categories: { id: string; nameJa: string; slug: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { parentId: null, products: { some: { isActive: true } } },
      select: { id: true, nameJa: true, slug: true },
      orderBy: { order: "asc" },
      take: 12,
    });
  } catch {}

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
