"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: "ダッシュボード" },
    { href: `/${locale}/admin/products`, icon: Package, label: "商品管理" },
    { href: `/${locale}/admin/orders`, icon: ShoppingBag, label: "注文管理" },
    { href: `/${locale}/admin/users`, icon: Users, label: "会員管理" },
    { href: `/${locale}/admin/banners`, icon: Image, label: "バナー管理" },
    { href: `/${locale}/admin/settings`, icon: Settings, label: "設定" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  return (
    <aside className="w-56 bg-[#1B6B2E] text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="font-bold text-lg">ハラール屋</div>
        <div className="text-[#C8961E] text-xs">管理画面</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== `/${locale}/admin` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/20 font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-1">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-0 py-2 text-sm text-white/70 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          サイトを見る
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 text-sm text-white/70 hover:text-white w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
