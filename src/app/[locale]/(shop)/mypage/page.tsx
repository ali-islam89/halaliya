import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function MypagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mypage" });
  const tos = await getTranslations({ locale, namespace: "orderStatus" });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { take: 1 } },
    });
  } catch {}

  const statusColors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-600",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { href: `/${locale}/mypage/orders`, icon: "📦", label: t("orders") },
          { href: `/${locale}/mypage/wishlist`, icon: "❤️", label: t("wishlist") },
          { href: `/${locale}/mypage/profile`, icon: "👤", label: t("profile") },
          { href: `/${locale}/mypage/addresses`, icon: "🏠", label: t("addresses") },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#1B6B2E] hover:bg-[#1B6B2E]/5 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">{t("orders")}</h2>
          <Link href={`/${locale}/mypage/orders`} className="text-sm text-[#1B6B2E] hover:underline">
            すべて見る
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl text-gray-400">
            {t("noOrders")}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{order.orderNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {tos(order.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{new Date(order.createdAt).toLocaleDateString("ja-JP")}</span>
                  <span className="font-bold text-[#1B6B2E]">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
