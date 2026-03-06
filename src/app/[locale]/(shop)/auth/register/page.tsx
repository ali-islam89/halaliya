"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  // 郵便番号から住所を自動入力（zipcloud API）
  const handlePostalLookup = async () => {
    const code = postalCode.replace(/-/g, "");
    if (code.length !== 7) return;
    setPostalLoading(true);
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
      const data = await res.json();
      if (data.results && data.results[0]) {
        const r = data.results[0];
        setPrefecture(r.address1);
        setCity(r.address2 + r.address3);
      }
    } catch {
      // silent
    } finally {
      setPostalLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          postalCode,
          prefecture,
          city,
          address1,
          address2,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?locale=${locale}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Prisma に User + Address を保存
    if (data.user && address1) {
      try {
        await fetch("/api/auth/register-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            email,
            name,
            phone,
            postalCode,
            prefecture,
            city,
            address1,
            address2,
          }),
        });
      } catch {
        // silent — プロフィール保存失敗はログイン後に対応可能
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2">{t("emailSentTitle")}</h2>
          <p className="text-gray-600 text-sm">
            {email} {t("emailSentBody")}
          </p>
          <Link href={`/${locale}/auth/login`} className="block mt-6 text-[#1B6B2E] hover:underline text-sm">
            {t("goToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1B6B2E] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">HL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("register")}</h1>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          {/* 基本情報 */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{t("name")} <span className="text-red-500">*</span></label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{t("email")} <span className="text-red-500">*</span></label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{t("password")} <span className="text-red-500">*</span></label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{t("phone")}</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="090-0000-0000"
            />
          </div>

          {/* 住所セクション */}
          <div className="pt-2">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              {t("addressSection")}
              <span className="text-xs font-normal text-gray-400 ml-1">{t("addressOptional")}</span>
            </p>
            <div className="space-y-3 border border-gray-100 rounded-xl p-4 bg-gray-50">
              {/* 郵便番号 */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t("postalCode")}</label>
                <div className="flex gap-2">
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="123-4567"
                    className="flex-1"
                    maxLength={8}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePostalLookup}
                    disabled={postalLoading || postalCode.replace(/-/g, "").length !== 7}
                    className="whitespace-nowrap text-xs"
                  >
                    {postalLoading ? "..." : t("autoFill")}
                  </Button>
                </div>
              </div>

              {/* 都道府県 */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t("prefecture")}</label>
                <Input
                  value={prefecture}
                  onChange={(e) => setPrefecture(e.target.value)}
                  placeholder="愛知県"
                />
              </div>

              {/* 市区町村 */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t("city")}</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="あま市木田西新五領"
                />
              </div>

              {/* 番地 */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t("address1")}</label>
                <Input
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="46-1"
                />
              </div>

              {/* 部屋番号 */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t("address2")}</label>
                <Input
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="○○マンション 101号室"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? t("processing") : t("register")}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t("alreadyMember")}{" "}
          <Link href={`/${locale}/auth/login`} className="text-[#1B6B2E] font-medium hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
