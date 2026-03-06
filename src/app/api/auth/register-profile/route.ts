import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name, phone, postalCode, prefecture, city, address1, address2 } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // User を upsert（すでに存在する場合は更新しない）
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email,
        name: name || null,
      },
    });

    // 住所がある場合は保存
    if (address1 && prefecture && city) {
      await prisma.address.create({
        data: {
          userId,
          name: name || "",
          phone: phone || "",
          postalCode: postalCode || "",
          prefecture,
          city,
          address1,
          address2: address2 || null,
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("register-profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
