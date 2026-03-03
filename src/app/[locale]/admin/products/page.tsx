import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Package } from "lucide-react";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        category: { select: { nameJa: true } },
        images: { take: 1, orderBy: { order: "asc" } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
        <Link href={`/${locale}/admin/products/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            商品を追加
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">商品</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">カテゴリ</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs">価格</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs">在庫</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs">状態</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>商品がありません</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {product.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0].url} alt={product.nameJa} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{product.nameJa}</p>
                        <p className="text-xs text-gray-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {product.category?.nameJa || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-bold ${product.stock === 0 ? "text-red-500" : product.stock <= 5 ? "text-orange-500" : "text-gray-900"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {product.isActive ? "公開" : "非公開"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
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
