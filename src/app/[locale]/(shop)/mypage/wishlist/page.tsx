import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Locale } from "@/types";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mypage" });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  let products: any[] = [];
  let wishlistIds: string[] = [];

  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    products = wishlist.map((w: any) => w.product).filter(Boolean);
    wishlistIds = products.map((p) => p.id);
  } catch {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("wishlist")}</h1>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">❤️</p>
          <p>{t("noWishlist")}</p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          locale={locale as Locale}
          wishlistedIds={new Set(wishlistIds)}
        />
      )}
    </div>
  );
}
