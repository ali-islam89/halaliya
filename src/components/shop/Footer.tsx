import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
  locale: string;
}

const localeFlags: Record<string, string> = { ja: "🇯🇵", tr: "🇹🇷", en: "🇺🇸" };
const localeLabels: Record<string, string> = { ja: "日本語", tr: "Türkçe", en: "English" };

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tm = useTranslations("mypage");
  const tc = useTranslations("common");

  const allLocales = ["ja", "tr", "en"] as const;

  return (
    <footer className="mt-16" style={{ background: "#1A3A5C" }}>
      {/* ━━ HALAL認証ステートメント ━━ */}
      <div
        className="text-center py-3 border-b"
        style={{ background: "#134d21", borderColor: "#C8961E" }}
      >
        <p className="text-sm font-medium" style={{ color: "#C8961E" }}>
          🌙 {t("halalStatement")}
        </p>
      </div>

      {/* ━━ チューリップパターン装飾帯 ━━ */}
      <div
        className="h-6 opacity-20 tulip-pattern"
        style={{ borderBottom: "1px solid rgba(200,150,30,0.3)" }}
      />

      {/* ━━ メインフッターコンテンツ ━━ */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-3 hover:opacity-90 transition-opacity">
              <Image
                src="/logo-white.svg"
                alt="ハラール屋 Halaliya"
                width={180}
                height={45}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t("address")}
            </p>
            {/* 言語切替 */}
            <div className="flex gap-3 mt-4">
              {allLocales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  className="flex items-center gap-1 text-xs transition-colors hover:opacity-100"
                  style={{ color: l === locale ? "#C8961E" : "rgba(255,255,255,0.5)" }}
                >
                  <span>{localeFlags[l]}</span>
                  <span>{localeLabels[l]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ショップ */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider" style={{ color: "#C8961E" }}>
              {t("shopSection")}
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              <li><Link href={`/${locale}/products`} className="hover:text-white hover:text-[#C8961E] transition-colors">{tn("products")}</Link></li>
              <li><Link href={`/${locale}/about`}    className="hover:text-white transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`}  className="hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* マイページ */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider" style={{ color: "#C8961E" }}>
              {t("myAccountSection")}
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              <li><Link href={`/${locale}/mypage/orders`}   className="hover:text-white transition-colors">{tm("orders")}</Link></li>
              <li><Link href={`/${locale}/mypage/wishlist`} className="hover:text-white transition-colors">{tc("wishlist")}</Link></li>
              <li><Link href={`/${locale}/auth/login`}      className="hover:text-white transition-colors">{tn("login")}</Link></li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider" style={{ color: "#C8961E" }}>
              {t("legalSection")}
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              <li><Link href={`/${locale}/legal`}          className="hover:text-white transition-colors">{t("legal")}</Link></li>
              <li><Link href={`/${locale}/legal#privacy`}  className="hover:text-white transition-colors">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ━━ コピーライト ━━ */}
      <div
        className="border-t py-4 text-center text-xs"
        style={{ borderColor: "rgba(200,150,30,0.3)", color: "rgba(255,255,255,0.45)" }}
      >
        {t("copyright")}
      </div>
    </footer>
  );
}
