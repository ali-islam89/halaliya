"use client";

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

export default function Header({ locale, categories = [] }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const cartCount = useCart((s) => s.totalItems)();
  const [mobileOpen, setMobileOpen] = useState(false);

  const localeLabels = { ja: "日本語", tr: "Türkçe", en: "English" };
  const otherLocales = (["ja", "tr", "en"] as const).filter((l) => l !== locale);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1B6B2E] text-white text-xs py-1 px-4 flex justify-between items-center">
        <span>🕌 {tc("siteTagline")}</span>
        <div className="flex items-center gap-3">
          <Globe className="h-3 w-3" />
          {otherLocales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="hover:underline"
            >
              {localeLabels[l]}
            </Link>
          ))}
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-[#1B6B2E] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">HL</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-[#1B6B2E] font-bold text-lg leading-none">ハラール屋</div>
            <div className="text-[#C8961E] text-xs">halaliya.com</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar locale={locale} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/mypage/wishlist`}>
            <Button variant="ghost" size="icon" aria-label={tc("wishlist")}>
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/${locale}/cart`} className="relative">
            <Button variant="ghost" size="icon" aria-label={tc("addToCart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8961E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href={`/${locale}/mypage`}>
            <Button variant="ghost" size="icon" aria-label={t("mypage")}>
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile menu */}
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

      {/* Category nav - desktop */}
      {categories.length > 0 && (
        <nav className="hidden md:block border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto">
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1B6B2E] hover:bg-[#1B6B2E]/5 whitespace-nowrap transition-colors"
                >
                  {tc("allCategories")}
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${locale}/products?category=${cat.slug}`}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1B6B2E] hover:bg-[#1B6B2E]/5 whitespace-nowrap transition-colors"
                  >
                    {cat.nameJa}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2">
            <Link
              href={`/${locale}/products`}
              className="block py-2 text-sm text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {t("products")}
            </Link>
            <Link
              href={`/${locale}/mypage`}
              className="block py-2 text-sm text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {t("mypage")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="block py-2 text-sm text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="block py-2 text-sm text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
