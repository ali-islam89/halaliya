"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/shop/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { calcTaxIncluded, calcTaxAmount, formatPrice } from "@/lib/utils";
import type { Locale } from "@/types";

interface Props {
  product: any;
  related: any[];
  locale: Locale;
}

export default function ProductDetailClient({ product, related, locale }: Props) {
  const t = useTranslations("common");
  const tp = useTranslations("products");
  const addItem = useCart((s) => s.addItem);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const name =
    locale === "tr" ? product.nameTr || product.nameJa :
    locale === "en" ? product.nameEn || product.nameJa :
    product.nameJa;

  const desc =
    locale === "tr" ? product.descTr || product.descJa :
    locale === "en" ? product.descEn || product.descJa :
    product.descJa;

  const priceIncl = calcTaxIncluded(product.price, product.taxRate);
  const taxAmt = calcTaxAmount(product.price, product.taxRate);
  const isOutOfStock = product.stock === 0;

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.nameJa,
      productSlug: product.slug,
      imageUrl: product.images[0]?.url,
      price: product.price,
      taxRate: product.taxRate,
      stock: product.stock,
      quantity: qty,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-[#1B6B2E]">ホーム</Link>
        <span>/</span>
        <Link href={`/${locale}/products`} className="hover:text-[#1B6B2E]">{tp("title")}</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/${locale}/products?category=${product.category.slug}`}
              className="hover:text-[#1B6B2E]"
            >
              {product.category.nameJa}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 line-clamp-1">{name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
            {product.images.length > 0 ? (
              <Image
                src={product.images[activeImg]?.url}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
                🛒
              </div>
            )}
            {product.isHalal && (
              <div className="absolute top-3 left-3">
                <Badge variant="halal">{tp("halalBadge")}</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    i === activeImg ? "border-[#1B6B2E]" : "border-transparent"
                  }`}
                >
                  <Image src={img.url} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/${locale}/products?category=${product.category.slug}`}
              className="text-xs text-[#1B6B2E] font-medium hover:underline"
            >
              {product.category.nameJa}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{name}</h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-[#C8961E] text-[#C8961E]" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({product.reviews.length}件)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <p className="text-3xl font-bold text-[#1B6B2E]">{formatPrice(priceIncl)}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              税抜 {formatPrice(product.price)} + 消費税 {formatPrice(taxAmt)}
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`} />
            <span className="text-sm text-gray-600">
              {isOutOfStock ? t("outOfStock") : `${t("inStock")} (残り${product.stock}点)`}
            </span>
          </div>

          {/* Weight */}
          {product.weight && (
            <p className="text-sm text-gray-600 mb-4">
              {tp("weight")}: {product.weight}g
            </p>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-700">{t("quantity")}</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isOutOfStock ? t("outOfStock") : t("addToCart")}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Description */}
          {desc && (
            <div className="border-t pt-4">
              <h2 className="font-semibold text-sm text-gray-900 mb-2">商品説明</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{tp("reviews")}</h2>
          <div className="space-y-3">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-[#C8961E] text-[#C8961E]" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.user.name || "匿名"}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{tp("relatedProducts")}</h2>
          <ProductGrid products={related} locale={locale} />
        </section>
      )}
    </div>
  );
}
