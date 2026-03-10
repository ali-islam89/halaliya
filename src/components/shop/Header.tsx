"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingCart, Heart, User, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

interface HeaderProps {
  locale: string;
  categories?: { id: string; nameJa: string; slug: string }[];
}

const localeFlags: Record<string, string> = { ja: "🇯🇵", tr: "🇹🇷", en: "🇺🇸" };
const localeLabels: Record<string, string> = { ja: "日本語", tr: "Türkçe", en: "English" };

export default function Header({ locale, categories = [] }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const cartCount = useCart((s) => s.totalItems)();
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLocales = (["ja", "tr", "en"] as const).filter((l) => l !== locale);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ━━ トップバー: グリーン×ゴールド ━━ */}
      <div
        className="text-white text-xs py-1.5 px-4 flex justify-between items-center"
        style={{ background: "linear-gradient(90deg, #134d21 0%, #1B6B2E 60%, #134d21 100%)" }}
      >
        {/* ゴールドの細線ボーダー下部 */}
        <span className="flex items-center gap-1.5">
          <span>🕌</span>
          <span className="text-white/90">{tc("siteTagline")}</span>
        </span>
        <div className="flex items-center gap-3">
          <Globe className="h-3 w-3 text-[#C8961E]" />
          {otherLocales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="hover:text-[#C8961E] transition-colors flex items-center gap-1"
            >
              <span>{localeFlags[l]}</span>
              <span className="hidden sm:inline">{localeLabels[l]}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ━━ メインヘッダー: 和紙ベージュ ━━ */}
      <div
        className="border-b"
        style={{ background: "#F8F3E8", borderColor: "#D4C9A8" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
          {/* ロゴ */}
          <Link href={`/${locale}`} className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <Image
              src="/logo-full.svg"
              alt="ハラール屋 Halaliya"
              width={200}
              height={50}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* 検索バー */}
          <div className="flex-1 max-w-xl">
            <SearchBar locale={locale} />
          </div>

          {/* アクションアイコン */}
          <div className="flex items-center gap-1">
            <Link href={`/${locale}/mypage/wishlist`}>
              <Button variant="ghost" size="icon" aria-label={tc("wishlist")}
                className="hover:text-[#C8102E] hover:bg-[#C8102E]/5">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href={`/${locale}/cart`} className="relative">
              <Button variant="ghost" size="icon" aria-label={tc("addToCart")}
                className="hover:text-[#1B6B2E] hover:bg-[#1B6B2E]/5">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C8961E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href={`/${locale}/mypage`}>
              <Button variant="ghost" size="icon" aria-label={t("mypage")}
                className="hover:text-[#1A3A5C] hover:bg-[#1A3A5C]/5">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* モバイルメニュー */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* ━━ カテゴリナビ: ゴールドボーダー ━━ */}
      {categories.length > 0 && (
        <nav
          className="hidden md:block border-b"
          style={{ background: "#F0EAD6", borderColor: "#C8961E" }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto">
              <li className="border-r" style={{ borderColor: "#D4C9A8" }}>
                <Link
                  href={`/${locale}/products`}
                  className="block px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                  style={{ color: "#1B6B2E" }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = "#C8102E"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = "#1B6B2E"; }}
                >
                  {tc("allCategories")}
                </Link>
              </li>
              {categories.map((cat, i) => (
                <li key={cat.id} className={i < categories.length - 1 ? "border-r" : ""}
                    style={{ borderColor: "#D4C9A8" }}>
                  <Link
                    href={`/${locale}/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 whitespace-nowrap transition-colors hover:text-[#C8102E] hover:bg-[#C8102E]/5"
                  >
                    {cat.nameJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* ━━ モバイルメニュー ━━ */}
      {mobileOpen && (
        <div className="md:hidden border-t" style={{ background: "#F8F3E8", borderColor: "#D4C9A8" }}>
          <nav className="px-4 py-3 space-y-1">
            {[
              { href: `/${locale}/products`, label: t("products") },
              { href: `/${locale}/mypage`,   label: t("mypage") },
              { href: `/${locale}/about`,    label: t("about") },
              { href: `/${locale}/contact`,  label: t("contact") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block py-2 px-3 text-sm rounded-lg text-gray-700 hover:text-[#1B6B2E] hover:bg-[#1B6B2E]/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* 言語切替 */}
            <div className="pt-2 border-t flex gap-3" style={{ borderColor: "#D4C9A8" }}>
              {otherLocales.map((l) => (
                <Link key={l} href={`/${l}`}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#1B6B2E]">
                  <span>{localeFlags[l]}</span>
                  <span>{localeLabels[l]}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
