import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/shop/HeroBanner";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductCarousel from "@/components/shop/ProductCarousel";
import PrayerTimesWidget from "@/components/shop/PrayerTimesWidget";
import Link from "next/link";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("siteName")} - ${t("siteDescription")}`,
  } satisfies Metadata;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });

  // バナー取得
  let banners: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let categories: any[] = [];

  try {
    [banners, featuredProducts, newArrivals, categories] = await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, stock: { gt: 0 } },
        include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.category.findMany({
        where: { parentId: null },
        orderBy: { order: "asc" },
        take: 8,
      }),
    ]);
  } catch {}

  return (
    <>
      {/* ヒーローバナー */}
      <HeroBanner banners={banners} locale={locale as Locale} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* メインコンテンツ */}
          <div className="flex-1 min-w-0">
            {/* カテゴリ */}
            {categories.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{t("popularCategories")}</h2>
                  <Link href={`/${locale}/products`} className="text-sm text-[#1B6B2E] hover:underline">
                    {tc("viewAll")}
                  </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products?category=${cat.slug}`}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[#1B6B2E]/5 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#1B6B2E]/10 flex items-center justify-center text-xl">
                        🛒
                      </div>
                      <span className="text-xs text-center text-gray-700 leading-tight">
                        {locale === "tr" ? cat.nameTr || cat.nameJa :
                         locale === "en" ? cat.nameEn || cat.nameJa : cat.nameJa}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* おすすめ商品カルーセル */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t("featuredProducts")}</h2>
                <Link href={`/${locale}/products`} className="text-sm text-[#1B6B2E] hover:underline">
                  {tc("viewAll")}
                </Link>
              </div>
              {featuredProducts.length > 0 ? (
                <div className="px-4">
                  <ProductCarousel
                    products={featuredProducts}
                    locale={locale as Locale}
                    title={t("featuredProducts")}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  <p>{t("preparingProducts")}</p>
                </div>
              )}
            </section>

            {/* 新着商品カルーセル */}
            {newArrivals.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{t("newArrivals")}</h2>
                  <Link href={`/${locale}/products?sort=new`} className="text-sm text-[#1B6B2E] hover:underline">
                    {tc("viewAll")}
                  </Link>
                </div>
                <div className="px-4">
                  <ProductCarousel
                    products={newArrivals}
                    locale={locale as Locale}
                    title={t("newArrivals")}
                  />
                </div>
              </section>
            )}
          </div>

          {/* サイドバー */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* 礼拝時間 */}
              <PrayerTimesWidget />

              {/* ハラール認証バナー */}
              <div className="bg-[#C8961E]/10 border border-[#C8961E]/30 rounded-xl p-4">
                <div className="text-[#C8961E] text-2xl mb-2">🌙</div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("halalGuaranteeTitle")}</h3>
                <p className="text-xs text-gray-600">
                  {t("halalGuaranteeText")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
