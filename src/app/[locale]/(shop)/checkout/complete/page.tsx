import { use } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = use(params);
  const sp = use(searchParams);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-20 w-20 text-[#1B6B2E] mx-auto mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        ご注文ありがとうございます！
      </h1>
      <p className="text-gray-600 mb-4">
        注文確認メールをお送りしました。
      </p>
      {sp.order && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">注文番号</p>
          <p className="text-xl font-bold text-[#1B6B2E] mt-1">{sp.order}</p>
        </div>
      )}
      <div className="space-y-2">
        <Link href={`/${locale}/mypage/orders`}>
          <Button className="w-full">注文履歴を確認する</Button>
        </Link>
        <Link href={`/${locale}`}>
          <Button variant="outline" className="w-full">ショッピングを続ける</Button>
        </Link>
      </div>
    </div>
  );
}
