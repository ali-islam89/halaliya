"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { calcTaxIncluded, formatPrice, calcShippingFee } from "@/lib/utils";

interface CartDrawerProps {
  locale: string;
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ locale, open, onClose }: CartDrawerProps) {
  const t = useTranslations("common");
  const tc = useTranslations("cart");
  const { items, removeItem, updateQuantity, subtotalExcl, totalTax } = useCart();

  const subtotal = subtotalExcl();
  const tax = totalTax();
  const shipping = calcShippingFee(subtotal);
  const total = subtotal + tax + shipping;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">{tc("title")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{tc("empty")}</p>
              <p className="text-xs text-gray-400 mt-1">{tc("emptyMessage")}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 items-start">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-sm text-[#1B6B2E] font-bold mt-0.5">
                      {formatPrice(calcTaxIncluded(item.price, item.taxRate))}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-[#1B6B2E] hover:text-[#1B6B2E]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-[#1B6B2E] hover:text-[#1B6B2E] disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-gray-400 hover:text-red-500 ml-auto"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t("subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t("tax_label")}</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t("shippingFee")}</span>
                <span>{shipping === 0 ? t("free") : formatPrice(shipping)}</span>
              </div>
              {subtotal < 10000 && (
                <p className="text-xs text-[#1B6B2E]">
                  {tc("freeShippingThreshold")}
                </p>
              )}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>{t("total")}</span>
              <span className="text-[#1B6B2E]">{formatPrice(total)}</span>
            </div>
            <Link href={`/${locale}/checkout`} onClick={onClose}>
              <Button className="w-full mt-2">{tc("checkout")}</Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1"
            >
              {t("continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
