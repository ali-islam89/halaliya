import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
    });
    if (!product) return { title: "Not Found" };
    const name = locale === "en" ? product.nameEn || product.nameJa : product.nameJa;
    return { title: name } satisfies Metadata;
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  let product: any = null;
  let related: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product?.categoryId) {
      related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          isActive: true,
          NOT: { id: product.id },
        },
        include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
        take: 4,
      });
    }
  } catch {}

  if (!product) notFound();

  return <ProductDetailClient product={product} related={related} locale={locale as Locale} />;
}
