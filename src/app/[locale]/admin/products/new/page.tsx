import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let categories: { id: string; nameJa: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, nameJa: true },
      orderBy: { nameJa: "asc" },
    });
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">商品を追加</h1>
      <ProductForm locale={locale} categories={categories} />
    </div>
  );
}
