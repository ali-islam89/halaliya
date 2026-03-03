import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-8xl font-bold text-[#1B6B2E] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ページが見つかりません</h1>
        <p className="text-gray-500 mb-6">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/ja">
          <Button>トップページに戻る</Button>
        </Link>
      </div>
    </div>
  );
}
