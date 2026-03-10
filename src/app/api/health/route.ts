import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":***@");

  try {
    const [productCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      db: "connected",
      products: productCount,
      categories: categoryCount,
      dbUrl: maskedUrl,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      db: "failed",
      error: error?.message || String(error),
      dbUrl: maskedUrl,
    }, { status: 500 });
  }
}
