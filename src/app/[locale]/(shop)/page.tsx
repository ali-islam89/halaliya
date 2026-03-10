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

      {/* ━━ 文化の架け橋バナー ━━ */}
      <div
        className="border-b"
        style={{ background: "linear-gradient(135deg, #1A3A5C 0%, #1B6B2E 100%)", borderColor: "#C8961E" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🇹🇷</span>
            <div className="text-white/40 text-2xl font-light">×</div>
            <span className="text-4xl">🇯🇵</span>
          </div>
          <div className="text-center sm:text-left">
            <p
              className="text-white font-bold text-lg leading-tight"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              {tc("bridgeTitle") || "トルコと日本をつなぐハラール食品"}
            </p>
            <p className="text-white/65 text-sm mt-1">
              {tc("bridgeSubtitle") || "Türk ve Japon kültürünü birleştiren helal ürünler"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: "rgba(200,150,30,0.15)", border: "1px solid rgba(200,150,30,0.4)" }}
            >
              <div className="text-[#C8961E] font-bold text-xl">100+</div>
              <div className="text-white/60 text-xs">SKU</div>
            </div>
            <div
              className="text-center px-4 py-2 rounded-lg"
              style={{ background: "rgba(200,150,30,0.15)", border: "1px solid rgba(200,150,30,0.4)" }}
            >
              <div className="text-[#C8961E] font-bold text-xl">HALAL</div>
              <div className="text-white/60 text-xs">認証済み</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* メインコンテンツ */}
          <div className="flex-1 min-w-0">
            {/* カテゴリ */}
            {categories.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Shippori Mincho', serif", color: "#1A3A5C" }}
                  >
                    {t("popularCategories")}
                  </h2>
                  <Link href={`/${locale}/products`}
                    className="text-sm hover:underline transition-colors"
                    style={{ color: "#C8961E" }}>
                    {tc("viewAll")}
                  </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/${locale}/products?category=${cat.slug}`}
                      className="group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all"
                      style={{ border: "1px solid transparent" }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "#C8961E";
                        el.style.background = "rgba(200,150,30,0.06)";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "transparent";
                        el.style.background = "transparent";
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors"
                        style={{ background: "rgba(27,107,46,0.1)" }}
                      >
                        🛒
                      </div>
                      <span
                        className="text-xs text-center leading-tight"
                        style={{ color: "#1A3A5C", fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
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
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1A3A5C" }}>
                  {t("featuredProducts")}
                </h2>
                <Link href={`/${locale}/products`} className="text-sm hover:underline" style={{ color: "#C8961E" }}>
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
                  <h2 className="text-xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1A3A5C" }}>
                    {t("newArrivals")}
                  </h2>
                  <Link href={`/${locale}/products?sort=new`} className="text-sm hover:underline" style={{ color: "#C8961E" }}>
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
              <div
                className="rounded-xl p-4"
                style={{
                  background: "linear-gradient(135deg, #1A3A5C, #1B6B2E)",
                  border: "1px solid rgba(200,150,30,0.4)",
                }}
              >
                <div className="text-2xl mb-2">🌙</div>
                <h3
                  className="font-semibold text-sm text-white mb-1"
                  style={{ fontFamily: "'Shippori Mincho', serif" }}
                >
                  {t("halalGuaranteeTitle")}
                </h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t("halalGuaranteeText")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg">🇹🇷</span>
                  <span style={{ color: "rgba(200,150,30,0.6)", fontSize: "10px" }}>×</span>
                  <span className="text-lg">🇯🇵</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
