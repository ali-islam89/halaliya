"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  locale: string;
  categories: { id: string; nameJa: string }[];
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({ locale, categories, initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images?.map((i: any) => i.url) || []);

  const [form, setForm] = useState({
    nameJa: initialData?.nameJa || "",
    nameTr: initialData?.nameTr || "",
    nameEn: initialData?.nameEn || "",
    slug: initialData?.slug || "",
    descJa: initialData?.descJa || "",
    descTr: initialData?.descTr || "",
    descEn: initialData?.descEn || "",
    price: initialData?.price || "",
    taxRate: initialData?.taxRate || "0.10",
    stock: initialData?.stock || "0",
    weight: initialData?.weight || "",
    categoryId: initialData?.categoryId || "",
    isHalal: initialData?.isHalal ?? true,
    isActive: initialData?.isActive ?? true,
  });

  const update = (field: keyof typeof form, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleTranslate = async () => {
    if (!form.nameJa) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [form.nameJa, form.descJa].filter(Boolean),
          sourceLang: "JA",
          targetLang: "TR",
        }),
      });
      const dataTr = await res.json();

      const resEn = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [form.nameJa, form.descJa].filter(Boolean),
          sourceLang: "JA",
          targetLang: "EN",
        }),
      });
      const dataEn = await resEn.json();

      setForm((f) => ({
        ...f,
        nameTr: dataTr.translations?.[0] || f.nameTr,
        descTr: dataTr.translations?.[1] || f.descTr,
        nameEn: dataEn.translations?.[0] || f.nameEn,
        descEn: dataEn.translations?.[1] || f.descEn,
      }));
    } catch {}
    setTranslating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = form.slug || generateSlug(form.nameJa);
    const payload = {
      ...form,
      slug,
      price: parseInt(String(form.price)),
      taxRate: parseFloat(String(form.taxRate)),
      stock: parseInt(String(form.stock)),
      weight: form.weight ? parseInt(String(form.weight)) : null,
      categoryId: form.categoryId || null,
      images,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "保存に失敗しました");
      }
    } catch {
      alert("エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-3">商品画像</h2>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">基本情報</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={translating || !form.nameJa}
          >
            {translating ? "翻訳中..." : "🌐 DeepLで翻訳"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">商品名（日本語）*</label>
            <Input
              required
              value={form.nameJa}
              onChange={(e) => {
                update("nameJa", e.target.value);
                if (!form.slug) update("slug", generateSlug(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">商品名（トルコ語）</label>
            <Input value={form.nameTr} onChange={(e) => update("nameTr", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">商品名（英語）</label>
            <Input value={form.nameEn} onChange={(e) => update("nameEn", e.target.value)} />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-gray-700 mb-1 block">スラッグ（URL）</label>
          <Input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="halal-chicken-breast"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-gray-700 mb-1 block">説明（日本語）</label>
            <textarea
              rows={4}
              value={form.descJa}
              onChange={(e) => update("descJa", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B2E] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">説明（トルコ語）</label>
            <textarea
              rows={4}
              value={form.descTr}
              onChange={(e) => update("descTr", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B2E] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">説明（英語）</label>
            <textarea
              rows={4}
              value={form.descEn}
              onChange={(e) => update("descEn", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B2E] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">価格・在庫</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">価格（税抜・円）*</label>
            <Input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">税率</label>
            <Select value={String(form.taxRate)} onValueChange={(v) => update("taxRate", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.10">10%（通常）</SelectItem>
                <SelectItem value="0.08">8%（軽減）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">在庫数</label>
            <Input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">重量（g）</label>
            <Input
              type="number"
              min={0}
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category & Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">カテゴリ・設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">カテゴリ</label>
            <Select value={form.categoryId || ""} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">なし</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.nameJa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isHalal}
                onChange={(e) => update("isHalal", e.target.checked)}
                className="text-[#1B6B2E] rounded"
              />
              <span className="text-sm">ハラール認証</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="text-[#1B6B2E] rounded"
              />
              <span className="text-sm">公開する</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "保存中..." : isEdit ? "更新する" : "商品を追加する"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push(`/${locale}/admin/products`)}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
