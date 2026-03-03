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
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* HALAL Badge */}
        {product.isHalal && (
          <div className="absolute top-2 left-2">
            <Badge variant="halal" className="text-[10px] px-1.5 py-0.5 rounded">
              {tp("halalBadge")}
            </Badge>
          </div>
        )}
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{t("outOfStock")}</span>
          </div>
        )}
        {/* Wishlist button */}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle(product.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            aria-label={wishlisted ? t("removeFromWishlist") : t("addToWishlist")}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{product.category?.nameJa || ""}</p>
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
          {name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[#1B6B2E] font-bold text-base">{formatPrice(priceIncl)}</p>
            <p className="text-xs text-gray-400">{t("tax")}</p>
          </div>
          <Button
            size="sm"
            variant={isOutOfStock ? "secondary" : "default"}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="shrink-0 h-8 px-2.5 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
}
