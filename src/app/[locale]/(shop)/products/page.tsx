import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/shop/ProductGrid";
import PrayerTimesWidget from "@/components/shop/PrayerTimesWidget";
import Link from "next/link";
import type { Locale } from "@/types";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title") } satisfies Metadata;
}

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}

const PAGE_SIZE = 24;

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  const page = Math.max(1, parseInt(sp.page || "1"));
  const skip = (page - 1) * PAGE_SIZE;

  // カテゴリ一覧
  let categories: any[] = [];
  let products: any[] = [];
  let total = 0;

  try {
    categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
    });

    const where: any = { isActive: true };
    if (sp.q) {
      where.OR = [
        { nameJa: { contains: sp.q, mode: "insensitive" } },
        { nameTr: { contains: sp.q, mode: "insensitive" } },
        { nameEn: { contains: sp.q, mode: "insensitive" } },
        { descJa: { contains: sp.q, mode: "insensitive" } },
      ];
    }
    if (sp.category) {
      const cat = categories.find((c) => c.slug === sp.category);
      if (cat) where.categoryId = cat.id;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sp.sort === "price") orderBy = { price: "asc" };
    if (sp.sort === "price_desc") orderBy = { price: "desc" };

    [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
        orderBy,
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);
  } catch {}

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildUrl = (overrides: Partial<SearchParams>) => {
    const merged = { ...sp, ...overrides };
    const qs = new URLSearchParams();
    if (merged.q) qs.set("q", merged.q);
    if (merged.category) qs.set("category", merged.category);
    if (merged.sort) qs.set("sort", merged.sort);
    if (merged.page && merged.page !== "1") qs.set("page", merged.page);
    const q = qs.toString();
    return `/${locale}/products${q ? `?${q}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* カテゴリフィルター */}
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">{t("filter")}</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href={buildUrl({ category: undefined, page: "1" })}
                    className={`block text-sm px-2 py-1.5 rounded-md transition-colors ${
                      !sp.category ? "bg-[#1B6B2E] text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    すべて ({total})
                  </Link>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={buildUrl({ category: cat.slug, page: "1" })}
                      className={`block text-sm px-2 py-1.5 rounded-md transition-colors ${
                        sp.category === cat.slug
                          ? "bg-[#1B6B2E] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {locale === "tr" ? cat.nameTr || cat.nameJa :
                       locale === "en" ? cat.nameEn || cat.nameJa : cat.nameJa}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <PrayerTimesWidget />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {sp.q ? `「${sp.q}」の検索結果` : t("title")}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {total}件
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t("sort")}:</span>
              <div className="flex gap-1">
                {[
                  { value: "", label: t("sortByNew") },
                  { value: "price", label: t("sortByPrice") },
                  { value: "price_desc", label: t("sortByPriceDesc") },
                ].map((s) => (
                  <Link
                    key={s.value}
                    href={buildUrl({ sort: s.value || undefined, page: "1" })}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      (sp.sort || "") === s.value
                        ? "bg-[#1B6B2E] text-white border-[#1B6B2E]"
                        : "border-gray-200 text-gray-600 hover:border-[#1B6B2E]"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">{t("noProducts")}</p>
            </div>
          ) : (
            <ProductGrid products={products} locale={locale as Locale} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:border-[#1B6B2E] hover:text-[#1B6B2E]"
                >
                  前へ
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + Math.max(1, page - 3);
                if (p > totalPages) return null;
                return (
                  <Link
                    key={p}
                    href={buildUrl({ page: String(p) })}
                    className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                      p === page
                        ? "bg-[#1B6B2E] text-white border-[#1B6B2E]"
                        : "border-gray-200 hover:border-[#1B6B2E] hover:text-[#1B6B2E]"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:border-[#1B6B2E] hover:text-[#1B6B2E]"
                >
                  次へ
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
