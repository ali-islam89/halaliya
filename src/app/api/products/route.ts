import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const categorySlug = searchParams.get("category");
  const sort = searchParams.get("sort") || "new";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const take = Math.min(48, parseInt(searchParams.get("limit") || "24"));
  const skip = (page - 1) * take;

  try {
    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { nameJa: { contains: q, mode: "insensitive" } },
        { nameTr: { contains: q, mode: "insensitive" } },
        { nameEn: { contains: q, mode: "insensitive" } },
      ];
    }

    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) where.categoryId = category.id;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          category: { select: { nameJa: true, slug: true } },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, take });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
