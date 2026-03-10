import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ハラール屋 | Halaliya",
    template: "%s | ハラール屋",
  },
  description: "日本在住ムスリム向けハラール認証済み食品・日用品専門店 halaliya.com",
  keywords: ["ハラール", "halal", "ハラール食品", "ムスリム", "日本", "helalfood", "トルコ", "helal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans:wght@400;500;700&family=Inter:wght@400;500;700&family=Shippori+Mincho:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
