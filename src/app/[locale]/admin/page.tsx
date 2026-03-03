import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let stats = { totalOrders: 0, totalUsers: 0, totalRevenue: 0, lowStockCount: 0 };
  let recentOrders: any[] = [];
  let lowStockProducts: any[] = [];

  try {
    const [orders, users, recentOrd, lowStock] = await Promise.all([
      prisma.order.aggregate({
        _count: { id: true },
        _sum: { total: true },
        where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
      }),
      prisma.user.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          guestName: true,
          paymentMethod: true,
        },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        select: { id: true, nameJa: true, stock: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),
    ]);

    stats = {
      totalOrders: orders._count.id,
      totalUsers: users,
      totalRevenue: orders._sum.total || 0,
      lowStockCount: lowStock.length,
    };
    recentOrders = recentOrd;
    lowStockProducts = lowStock;
  } catch {}

  const statusColors: Record<string, string> = {
    PENDING: "text-gray-500",
    PAYMENT_PENDING: "text-yellow-600",
    PAID: "text-blue-600",
    PROCESSING: "text-blue-600",
    SHIPPED: "text-purple-600",
    DELIVERED: "text-green-600",
    CANCELLED: "text-red-600",
    REFUNDED: "text-orange-600",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "受付",
    PAYMENT_PENDING: "支払い待ち",
    PAID: "支払い完了",
    PROCESSING: "準備中",
    SHIPPED: "発送済み",
    DELIVERED: "配達完了",
    CANCELLED: "キャンセル",
    REFUNDED: "返金済み",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1B6B2E]/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#1B6B2E]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">総売上</p>
                <p className="text-xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">総注文数</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">総会員数</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">在庫不足</p>
                <p className="text-xl font-bold text-gray-900">{stats.lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">最新注文</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">注文番号</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">ステータス</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">金額</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-xs">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.guestName || "会員"}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-xs">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Low stock */}
        {lowStockProducts.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                在庫不足商品
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">商品名</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-gray-500">残数</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-xs">{p.nameJa}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-bold ${p.stock === 0 ? "text-red-600" : "text-orange-500"}`}>
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
