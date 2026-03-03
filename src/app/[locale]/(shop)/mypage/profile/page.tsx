"use client";

import { use, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { name } });
    if (error) {
      setMessage("更新に失敗しました: " + error.message);
    } else {
      setMessage("プロフィールを更新しました");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">プロフィール</h1>

      <form onSubmit={handleSave} className="space-y-4 mb-8">
        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">{message}</div>
        )}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">{t("name")}</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="お名前"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </form>

      <div className="border-t pt-6">
        <Button variant="destructive" onClick={handleLogout}>
          ログアウト
        </Button>
      </div>
    </div>
  );
}
