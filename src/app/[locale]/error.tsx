"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <p className="text-6xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h1>
        <p className="text-gray-500 mb-6">
          申し訳ございません。予期せぬエラーが発生しました。
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>再試行</Button>
          <Button variant="outline" onClick={() => window.location.href = "/ja"}>
            トップへ
          </Button>
        </div>
      </div>
    </div>
  );
}
