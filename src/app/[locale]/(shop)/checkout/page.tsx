"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, calcShippingFee, PREFECTURES } from "@/lib/utils";
import { calcTaxIncluded } from "@/lib/utils";

type PaymentMethod = "CREDIT" | "PAYPAY" | "COD";

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("common");
  const tc = useTranslations("checkout");
  const router = useRouter();
  const { items, subtotalExcl, totalTax, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CREDIT");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    postalCode: "", prefecture: "愛知県", city: "", address1: "", address2: "",
    note: "",
  });

  const subtotal = subtotalExcl();
  const tax = totalTax();
  const shipping = calcShippingFee(subtotal);
  const codFee = paymentMethod === "COD" ? 330 : 0;
  const total = subtotal + tax + shipping + codFee;

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            price: i.price,
            taxRate: i.taxRate,
            quantity: i.quantity,
          })),
          paymentMethod,
          shipping: form,
          subtotal,
          taxAmount: tax,
          shippingFee: shipping,
          codFee,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Order failed");

      if (paymentMethod === "CREDIT" && data.stripeUrl) {
        window.location.href = data.stripeUrl;
      } else if (paymentMethod === "PAYPAY" && data.paypayUrl) {
        window.location.href = data.paypayUrl;
      } else {
        clearCart();
        router.push(`/${locale}/checkout/complete?order=${data.orderNumber}`);
      }
    } catch (err: any) {
      alert(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">カートに商品がありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tc("title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <section className="border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-lg mb-4">{tc("shipping")}</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      {tc("name")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="山田 太郎"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      {tc("phone")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="090-0000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    {tc("email")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      {tc("postalCode")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={form.postalCode}
                      onChange={(e) => update("postalCode", e.target.value)}
                      placeholder="490-1111"
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      {tc("prefecture")} <span className="text-red-500">*</span>
                    </label>
                    <Select value={form.prefecture} onValueChange={(v) => update("prefecture", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFECTURES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      {tc("city")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="あま市"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    {tc("address1")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={form.address1}
                    onChange={(e) => update("address1", e.target.value)}
                    placeholder="木田西新五領46-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    {tc("address2")}
                  </label>
                  <Input
                    value={form.address2}
                    onChange={(e) => update("address2", e.target.value)}
                    placeholder="マンション名・部屋番号"
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-lg mb-4">{tc("payment")}</h2>
              <div className="space-y-2">
                {(
                  [
                    { value: "CREDIT", label: tc("paymentCredit"), icon: "💳" },
                    { value: "PAYPAY", label: tc("paymentPaypay"), icon: "📱" },
                    { value: "COD", label: tc("paymentCod"), icon: "🏷️" },
                  ] as const
                ).map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.value
                        ? "border-[#1B6B2E] bg-[#1B6B2E]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="text-[#1B6B2E]"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="font-medium text-sm">{method.label}</span>
                    {method.value === "COD" && paymentMethod === "COD" && (
                      <span className="text-xs text-gray-500 ml-auto">{tc("codNote")}</span>
                    )}
                  </label>
                ))}
              </div>
            </section>

            {/* Note */}
            <section className="border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-lg mb-3">{tc("note")}</h2>
              <textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder={tc("notePlaceholder")}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B2E] resize-none"
              />
            </section>
          </div>

          {/* Order summary */}
          <div>
            <div className="border border-gray-200 rounded-xl p-5 sticky top-24">
              <h2 className="font-bold text-lg mb-4">{t("subtotal")}</h2>
              <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-2">
                    <span className="line-clamp-1 flex-1">{item.productName} ×{item.quantity}</span>
                    <span className="shrink-0 font-medium">{formatPrice(calcTaxIncluded(item.price, item.taxRate) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>小計(税抜)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>消費税</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>送料</span>
                  <span>{shipping === 0 ? "無料" : formatPrice(shipping)}</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>代引き手数料</span>
                    <span>{formatPrice(codFee)}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("total")}</span>
                  <span className="text-[#1B6B2E]">{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "処理中..." : tc("placeOrder")}
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                🔒 SSL暗号化通信で安全に処理されます
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
