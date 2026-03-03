import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", stripePaymentId: session.payment_intent },
        include: { items: true },
      });

      // Update stock
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Update to PROCESSING
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });

      // Send confirmation email
      const email = session.customer_details?.email;
      if (email && process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `【ハラール屋】ご注文確認 ${order.orderNumber}`,
          html: `
            <h2>ご注文ありがとうございます</h2>
            <p>注文番号: <strong>${order.orderNumber}</strong></p>
            <p>お支払い方法: クレジットカード</p>
            <p>合計金額: ¥${order.total.toLocaleString()}</p>
          `,
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
