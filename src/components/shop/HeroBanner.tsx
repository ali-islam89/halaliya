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
    // ━━ デフォルトバナー: トルコ×日本グラデーション ━━
    return (
      <div
        className="relative w-full h-64 md:h-96 flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A3A5C 0%, #1B6B2E 45%, #8B1A2B 100%)",
        }}
      >
        {/* 青海波パターン（左側・和の装飾） */}
        <div
          className="absolute inset-0 seigaiha-pattern opacity-10 pointer-events-none"
        />

        {/* チューリップ装飾（右側） */}
        <div
          className="absolute right-0 top-0 h-full w-2/5 opacity-10 tulip-pattern pointer-events-none"
        />

        {/* 角装飾（左上） */}
        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-40">
            <path d="M0 0 L64 0 L0 64 Z" fill="#C8961E" opacity="0.3"/>
            <path d="M0 0 L32 0 L0 32 Z" fill="#C8961E" opacity="0.5"/>
          </svg>
        </div>
        {/* 角装飾（右下） */}
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-40">
            <path d="M64 64 L0 64 L64 0 Z" fill="#C8961E" opacity="0.3"/>
            <path d="M64 64 L32 64 L64 32 Z" fill="#C8961E" opacity="0.5"/>
          </svg>
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            {/* ゴールドの細い上線 */}
            <div className="w-16 h-0.5 bg-[#C8961E] mb-4 opacity-80" />
            <h1
              className="text-white text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "'Shippori Mincho', 'Noto Serif JP', serif", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              {t("heroTitle")}
            </h1>
            <p className="text-white/85 text-base md:text-lg mb-6 leading-relaxed">
              {t("heroSubtitle")}
            </p>
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/products`}>
                <Button
                  size="lg"
                  style={{ background: "#C8961E", color: "white", border: "none", fontWeight: 700 }}
                  className="hover:opacity-90 transition-opacity shadow-lg"
                >
                  {t("shopNow")}
                </Button>
              </Link>
              <div className="text-white/60 text-sm flex items-center gap-1">
                <span>🇹🇷</span><span className="mx-1">×</span><span>🇯🇵</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右側の三日月シルエット装飾 */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden md:block">
          <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,-40 A50,50 0 1,1 30,40 A36,36 0 1,0 30,-40 Z"
              fill="white" transform="translate(60,60) rotate(-20)"/>
            <polygon points="0,-18 4,-5 17,-5 7,3 11,16 0,8 -11,16 -7,3 -17,-5 -4,-5"
              fill="white" transform="translate(95,42)"/>
          </svg>
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
            <div className="w-12 h-0.5 bg-[#C8961E] mb-2" />
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "'Shippori Mincho', serif" }}
            >
              {title}
            </h2>
          </div>
        </div>
      )}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all ${i === current ? "w-4 h-2 rounded-full bg-[#C8961E]" : "w-2 h-2 rounded-full bg-white/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
