"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { calcTaxIncluded, formatPrice } from "@/lib/utils";
import type { Product, Locale } from "@/types";

interface ProductCarouselProps {
  products: Product[];
  locale: Locale;
  title: string;
}

const VISIBLE = 4; // 一度に表示するカード数（デスクトップ）

export default function ProductCarousel({ products, locale, title }: ProductCarouselProps) {
  const t = useTranslations("common");
  const tp = useTranslations("products");
  const addItem = useCart((s) => s.addItem);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, products.length - VISIBLE);

  const goNext = useCallback(() => {
    if (isAnimating || products.length <= VISIBLE) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, maxIndex, products.length]);

  const goPrev = useCallback(() => {
    if (isAnimating || products.length <= VISIBLE) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, maxIndex, products.length]);

  // 自動スライド
  useEffect(() => {
    if (products.length <= VISIBLE) return;
    intervalRef.current = setInterval(goNext, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, products.length]);

  // ホバー中は自動スライド停止
  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const handleMouseLeave = () => {
    if (products.length <= VISIBLE) return;
    intervalRef.current = setInterval(goNext, 3500);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* スライドトラック */}
        <div
          className="flex gap-4 transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(calc(-${current} * (100% / ${Math.min(products.length, VISIBLE)} + 1rem / ${Math.min(products.length, VISIBLE)})))` }}
        >
          {products.map((product, index) => {
            const name =
              locale === "tr" ? product.nameTr || product.nameJa :
              locale === "en" ? product.nameEn || product.nameJa :
              product.nameJa;
            const imageUrl = product.images[0]?.url || "/images/placeholder.png";
            const priceIncl = calcTaxIncluded(product.price, product.taxRate);
            const isOutOfStock = product.stock === 0;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="flex-none group block rounded-2xl border border-gray-200 bg-white overflow-hidden cursor-pointer"
                style={{
                  width: `calc((100% - ${(VISIBLE - 1) * 1}rem) / ${VISIBLE})`,
                  boxShadow: isHovered
                    ? "0 20px 40px rgba(27,107,46,0.18)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  transform: isHovered ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 画像 */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500"
                    style={{ transform: isHovered ? "scale(1.12)" : "scale(1)" }}
                  />
                  {/* HALALバッジ */}
                  {product.isHalal && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="halal" className="text-[10px] px-1.5 py-0.5 rounded">
                        {tp("halalBadge")}
                      </Badge>
                    </div>
                  )}
                  {/* 在庫切れ */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{t("outOfStock")}</span>
                    </div>
                  )}
                  {/* ホバー時のオーバーレイ */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#1B6B2E]/60 to-transparent flex items-end justify-center pb-3 transition-opacity duration-300"
                    style={{ opacity: isHovered ? 1 : 0 }}
                  >
                    <Button
                      size="sm"
                      className="bg-white text-[#1B6B2E] hover:bg-[#1B6B2E] hover:text-white text-xs px-3"
                      disabled={isOutOfStock}
                      onClick={(e) => {
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
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      {t("addToCart")}
                    </Button>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{product.category?.nameJa || ""}</p>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                    {name}
                  </h3>
                  <p className="text-[#1B6B2E] font-bold text-base">{formatPrice(priceIncl)}</p>
                  <p className="text-xs text-gray-400">{t("tax")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      {products.length > VISIBLE && (
        <>
          <button
            onClick={goPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1B6B2E] hover:text-white transition-all duration-200 border border-gray-200"
            aria-label="前へ"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1B6B2E] hover:text-white transition-all duration-200 border border-gray-200"
            aria-label="次へ"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* ドットインジケーター */}
      {products.length > VISIBLE && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? "#1B6B2E" : "#d1d5db",
              }}
              aria-label={`${i + 1}番目へ`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
