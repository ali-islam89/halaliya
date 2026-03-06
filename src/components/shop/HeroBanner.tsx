"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner, Locale } from "@/types";

interface HeroBannerProps {
  banners: Banner[];
  locale: Locale;
}

export default function HeroBanner({ banners, locale }: HeroBannerProps) {
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    // デフォルトバナー
    return (
      <div className="relative w-full h-64 md:h-96 bg-gradient-to-r from-[#1B6B2E] to-[#2a8a3d] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3 leading-tight text-balance">
              {t("heroTitle")}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-6">
              {t("heroSubtitle")}
            </p>
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="accent">
                {t("shopNow")}
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <div className="text-white text-9xl font-bold text-right pr-8 pt-8 select-none">
            ハラール
          </div>
        </div>
      </div>
    );
  }

  const banner = banners[current];
  const title =
    locale === "tr" ? banner.titleTr || banner.titleJa :
    locale === "en" ? banner.titleEn || banner.titleJa :
    banner.titleJa;

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-100">
      <Image
        src={banner.imageUrl}
        alt={title || "Banner"}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      {title && (
        <div className="absolute inset-0 bg-black/30 flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
      )}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
