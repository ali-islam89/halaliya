import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-[#1B6B2E] text-white mt-16">
      {/* HALAL認証ステートメント */}
      <div className="bg-[#134d21] text-center py-3">
        <p className="text-sm font-medium text-[#C8961E]">
          🌙 {t("halalStatement")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1B6B2E] text-xs font-bold">HL</span>
              </div>
              <div>
                <div className="font-bold text-lg leading-none">ハラール屋</div>
                <div className="text-[#C8961E] text-xs">halaliya.com</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {t("address")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-[#C8961E]">ショップ</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href={`/${locale}/products`} className="hover:text-white">{tn("products")}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-white">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white">{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#C8961E]">マイアカウント</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href={`/${locale}/mypage/orders`} className="hover:text-white">購入履歴</Link></li>
              <li><Link href={`/${locale}/mypage/wishlist`} className="hover:text-white">お気に入り</Link></li>
              <li><Link href={`/${locale}/auth/login`} className="hover:text-white">{tn("login")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#C8961E]">法的情報</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href={`/${locale}/legal`} className="hover:text-white">{t("legal")}</Link></li>
              <li><Link href={`/${locale}/legal#privacy`} className="hover:text-white">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-xs text-white/60">
        {t("copyright")}
      </div>
    </footer>
  );
}
