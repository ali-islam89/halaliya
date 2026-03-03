import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      paymentMethod,
      shipping,
      subtotal,
      taxAmount,
      shippingFee,
      codFee,
      total,
      userId,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Validate stock
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, isActive: true },
      });
      if (!product || !product.isActive || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `商品「${item.productName}」の在庫が不足しています` },
          { status: 400 }
        );
      }
    }

    // Create order in PENDING state
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        guestEmail: shipping.email,
        guestName: shipping.name,
        guestPhone: shipping.phone,
        shippingName: shipping.name,
        shippingPostal: shipping.postalCode,
        shippingPref: shipping.prefecture,
        shippingCity: shipping.city,
        shippingAddr1: shipping.address1,
        shippingAddr2: shipping.address2 || null,
        shippingPhone: shipping.phone,
        status: "PENDING",
        paymentMethod,
        subtotal,
        taxAmount,
        shippingFee,
        codFee: codFee || 0,
        total,
        note: shipping.note || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            taxRate: item.taxRate,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Payment handling
    if (paymentMethod === "CREDIT") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        locale: "ja",
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "jpy",
            product_data: { name: item.productName },
            unit_amount: Math.floor(item.price * (1 + item.taxRate)),
          },
          quantity: item.quantity,
        })),
        metadata: { orderId: order.id, orderNumber },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ja/checkout/complete?order=${orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/ja/checkout`,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentId: session.id, status: "PAYMENT_PENDING" },
      });

      return NextResponse.json({ orderNumber, stripeUrl: session.url });
    }

    if (paymentMethod === "PAYPAY") {
      // PayPay integration (sandbox)
      // In production, use PayPay SDK for server-side QR code creation
      const paypayOrderId = `PP-${orderNumber}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { paypayOrderId, status: "PAYMENT_PENDING" },
      });
      // For now, redirect to a mock PayPay page
      // Real implementation: call PayPay API to create payment
      return NextResponse.json({
        orderNumber,
        paypayUrl: `${process.env.NEXT_PUBLIC_APP_URL}/ja/checkout/complete?order=${orderNumber}`,
      });
    }

    // COD: decrease stock and send email
    if (paymentMethod === "COD") {
      // Update stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" },
      });

      // Send confirmation email
      if (shipping.email && process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: shipping.email,
          subject: `【ハラール屋】ご注文確認 ${orderNumber}`,
          html: `
            <h2>ご注文ありがとうございます</h2>
            <p>注文番号: <strong>${orderNumber}</strong></p>
            <p>お支払い方法: 代金引換</p>
            <p>合計金額: ¥${total.toLocaleString()}</p>
            <p>ご注文内容の確認は <a href="${process.env.NEXT_PUBLIC_APP_URL}/ja/mypage/orders">こちら</a></p>
          `,
        }).catch(() => {}); // Email failure should not fail the order
      }

      return NextResponse.json({ orderNumber });
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message || "Order failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
