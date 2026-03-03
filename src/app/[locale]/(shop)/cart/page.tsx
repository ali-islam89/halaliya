"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { calcTaxIncluded, formatPrice, calcShippingFee } from "@/lib/utils";

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("common");
  const tc = useTranslations("cart");
  const { items, removeItem, updateQuantity, subtotalExcl, totalTax } = useCart();

  const subtotal = subtotalExcl();
  const tax = totalTax();
  const shipping = calcShippingFee(subtotal);
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tc("title")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-lg text-gray-500 mb-2">{tc("empty")}</p>
          <p className="text-sm text-gray-400 mb-6">{tc("emptyMessage")}</p>
          <Link href={`/${locale}/products`}>
            <Button>{t("continueShopping")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const priceIncl = calcTaxIncluded(item.price, item.taxRate);
              return (
                <div key={item.productId} className="flex gap-4 border border-gray-100 rounded-xl p-4 bg-white">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.productName} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/products/${item.productSlug}`}
                      className="text-sm font-medium text-gray-900 hover:text-[#1B6B2E] line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-[#1B6B2E] font-bold mt-1">{formatPrice(priceIncl)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(priceIncl * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label={tc("remove")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div>
            <div className="border border-gray-200 rounded-xl p-5 sticky top-24">
              <h2 className="font-bold text-lg mb-4">{tc("orderSummary")}</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>{t("subtotal")} (税抜)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("tax_label")}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("shippingFee")}</span>
                  <span>{shipping === 0 ? <span className="text-[#1B6B2E] font-medium">{t("free")}</span> : formatPrice(shipping)}</span>
                </div>
              </div>
              {subtotal < 10000 && (
                <div className="bg-[#1B6B2E]/5 rounded-lg p-2.5 mb-3">
                  <p className="text-xs text-[#1B6B2E]">
                    あと{formatPrice(10000 - subtotal)}(税抜)で送料無料！
                  </p>
                </div>
              )}
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("total")}</span>
                  <span className="text-[#1B6B2E]">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href={`/${locale}/checkout`}>
                <Button size="lg" className="w-full">
                  {tc("checkout")}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href={`/${locale}/products`} className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3">
                {t("continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
