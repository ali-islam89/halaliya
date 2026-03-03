import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  let product: any = null;
  let categories: { id: string; nameJa: string }[] = [];

  try {
    [product, categories] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { order: "asc" } } },
      }),
      prisma.category.findMany({
        select: { id: true, nameJa: true },
        orderBy: { nameJa: "asc" },
      }),
    ]);
  } catch {}

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">商品を編集</h1>
      <ProductForm locale={locale} categories={categories} initialData={product} isEdit />
    </div>
  );
}
