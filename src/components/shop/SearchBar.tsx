"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface SearchBarProps {
  locale: string;
  initialValue?: string;
}

export default function SearchBar({ locale, initialValue = "" }: SearchBarProps) {
  const t = useTranslations("common");
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    startTransition(() => {
      router.push(`/${locale}/products?q=${encodeURIComponent(value.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full h-9 pl-4 pr-10 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B2E] focus:border-transparent bg-gray-50"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B6B2E] transition-colors"
        disabled={isPending}
        aria-label={t("search")}
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
