"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { calcTaxIncluded, formatPrice } from "@/lib/utils";
import type { Product, Locale } from "@/types";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  wishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
}

export default function ProductCard({
  product,
  locale,
  wishlisted = false,
  onWishlistToggle,
}: ProductCardProps) {
  const t = useTranslations("common");
  const tp = useTranslations("products");
  const addItem = useCart((s) => s.addItem);

  const name =
    locale === "tr" ? product.nameTr || product.nameJa :
    locale === "en" ? product.nameEn || product.nameJa :
    product.nameJa;

  const imageUrl = product.images[0]?.url || "/images/placeholder.png";
  const priceIncl = calcTaxIncluded(product.price, product.taxRate);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      productName: product.nameJa,
      productSlug: product.slug,
      imageUrl,
      price: product.price,
      taxRate: product.taxRate,
      stock: product.stock,
    });
  };

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block bg-white overflow-hidden transition-all duration-200"
      style={{
        borderRadius: "8px",
        border: "1px solid #E5DCC8",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
        el.style.borderLeftColor = "#C8102E";
        el.style.borderLeftWidth = "3px";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
        el.style.borderLeftColor = "#E5DCC8";
        el.style.borderLeftWidth = "1px";
      }}
    >
      {/* 商品画像 */}
      <div className="relative aspect-square overflow-hidden" style={{ background: "#FAF7F2" }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* HALALバッジ */}
        {product.isHalal && (
          <div className="absolute top-2 left-2">
            <Badge variant="halal" className="text-[10px] px-1.5 py-0.5 rounded">
              {tp("halalBadge")}
            </Badge>
          </div>
        )}
        {/* 在庫切れオーバーレイ */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{t("outOfStock")}</span>
          </div>
        )}
        {/* ウィッシュリストボタン */}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle(product.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
            aria-label={wishlisted ? t("removeFromWishlist") : t("addToWishlist")}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? "fill-[#C8102E] text-[#C8102E]" : "text-gray-300 group-hover:text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* カードコンテンツ */}
      <div className="p-3">
        {/* カテゴリ */}
        <p className="text-[10px] font-medium tracking-wider uppercase mb-1"
           style={{ color: "#C8961E" }}>
          {product.category?.nameJa || ""}
        </p>

        {/* 商品名（明朝体） */}
        <h3
          className="text-sm line-clamp-2 mb-2.5 min-h-[2.5rem] leading-snug"
          style={{
            fontFamily: "'Shippori Mincho', 'Noto Serif JP', serif",
            color: "#1A3A5C",
            fontWeight: 600,
          }}
        >
          {name}
        </h3>

        {/* ゴールドの細い区切り線 */}
        <div className="w-full h-px mb-2.5" style={{ background: "linear-gradient(90deg, #C8961E, transparent)" }} />

        {/* 価格 + カートボタン */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-base" style={{ color: "#1A3A5C" }}>
              {formatPrice(priceIncl)}
            </p>
            <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{t("tax")}</p>
          </div>
          <Button
            size="sm"
            variant={isOutOfStock ? "secondary" : "default"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="shrink-0 h-8 px-2.5 text-xs transition-colors"
            style={isOutOfStock ? {} : { background: "#1B6B2E", color: "white", border: "none" }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
