import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mypage" });
  const tos = await getTranslations({ locale, namespace: "orderStatus" });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: { include: { images: { take: 1 } } } },
        },
      },
      orderBy: { createdAt: "desc" },
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("orders")}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-gray-400">
          <p className="text-lg mb-4">{t("noOrders")}</p>
          <Link href={`/${locale}/products`}>
            <Button>商品を探す</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{order.orderNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || ""}`}>
                    {tos(order.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("ja-JP")}
                </div>
              </div>
              <div className="p-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.product?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.images[0].url} alt={item.productName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-gray-500">×{item.quantity} / {formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1B6B2E]">合計: {formatPrice(order.total)}</span>
                  {order.trackingNumber && (
                    <span className="text-xs text-gray-500">追跡: {order.trackingNumber}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
