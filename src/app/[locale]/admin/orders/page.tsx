import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import OrderActions from "./OrderActions";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "受付",
  PAYMENT_PENDING: "支払い待ち",
  PAID: "支払い完了",
  PROCESSING: "準備中",
  SHIPPED: "発送済み",
  DELIVERED: "配達完了",
  CANCELLED: "キャンセル",
  REFUNDED: "返金済み",
};

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT: "クレジット",
  PAYPAY: "PayPay",
  COD: "代引き",
};

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: { items: { select: { productName: true, quantity: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">注文管理</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">注文番号</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">顧客</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">支払い</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">金額</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">ステータス</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">日時</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  注文がありません
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.items.length}商品</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{order.guestName || "会員"}</p>
                    <p className="text-xs text-gray-400">{order.guestEmail || ""}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {PAYMENT_LABELS[order.paymentMethod]}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-xs">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderActions orderId={order.id} currentStatus={order.status} trackingNumber={order.trackingNumber} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
