"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      }
      onChange([...images, ...newUrls]);
    } catch {}
    setUploading(false);
    e.target.value = "";
  }, [images, onChange]);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <Image src={url} alt={`Image ${i + 1}`} fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
                メイン
              </span>
            )}
          </div>
        ))}

        {/* Upload button */}
        <label className={`w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? "border-gray-200 bg-gray-50" : "border-gray-300 hover:border-[#1B6B2E] hover:bg-[#1B6B2E]/5"}`}>
          <Upload className={`h-6 w-6 mb-1 ${uploading ? "text-gray-300" : "text-gray-400"}`} />
          <span className="text-xs text-gray-400">{uploading ? "アップロード中..." : "追加"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-xs text-gray-400">最初の画像がメイン画像として表示されます。JPEG・PNG・WebP対応。</p>
    </div>
  );
}
