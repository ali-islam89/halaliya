import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 税込価格を計算（円） */
export function calcTaxIncluded(priceExcl: number, taxRate: number): number {
  return Math.floor(priceExcl * (1 + taxRate));
}

/** 税額を計算（円） */
export function calcTaxAmount(priceExcl: number, taxRate: number): number {
  return Math.floor(priceExcl * taxRate);
}

/** 通貨フォーマット */
export function formatPrice(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

/** 注文番号生成 */
export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HL${y}${m}${d}-${rand}`;
}

/** slugを日本語から生成 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || `product-${Date.now()}`;
}

/** 送料計算（税抜小計で判定） */
export function calcShippingFee(subtotalExcl: number, freeThreshold = 10000, defaultFee = 800): number {
  return subtotalExcl >= freeThreshold ? 0 : defaultFee;
}

/** 日本の都道府県リスト */
export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

/** 都道府県→緯度経度マップ（Aladhan API用） */
export const PREFECTURE_COORDS: Record<string, { lat: string; lng: string }> = {
  "北海道": { lat: "43.0642", lng: "141.3469" },
  "青森県": { lat: "40.8244", lng: "140.7400" },
  "岩手県": { lat: "39.7036", lng: "141.1527" },
  "宮城県": { lat: "38.2688", lng: "140.8721" },
  "秋田県": { lat: "39.7186", lng: "140.1023" },
  "山形県": { lat: "38.2404", lng: "140.3633" },
  "福島県": { lat: "37.7500", lng: "140.4676" },
  "茨城県": { lat: "36.3418", lng: "140.4468" },
  "栃木県": { lat: "36.5657", lng: "139.8836" },
  "群馬県": { lat: "36.3911", lng: "139.0608" },
  "埼玉県": { lat: "35.8617", lng: "139.6453" },
  "千葉県": { lat: "35.6073", lng: "140.1063" },
  "東京都": { lat: "35.6762", lng: "139.6503" },
  "神奈川県": { lat: "35.4474", lng: "139.6425" },
  "新潟県": { lat: "37.9026", lng: "139.0234" },
  "富山県": { lat: "36.6953", lng: "137.2113" },
  "石川県": { lat: "36.5947", lng: "136.6256" },
  "福井県": { lat: "36.0652", lng: "136.2216" },
  "山梨県": { lat: "35.6642", lng: "138.5681" },
  "長野県": { lat: "36.6513", lng: "138.1810" },
  "岐阜県": { lat: "35.3912", lng: "136.7223" },
  "静岡県": { lat: "34.9769", lng: "138.3831" },
  "愛知県": { lat: "35.1802", lng: "136.9066" },
  "三重県": { lat: "34.7303", lng: "136.5086" },
  "滋賀県": { lat: "35.0045", lng: "135.8686" },
  "京都府": { lat: "35.0211", lng: "135.7556" },
  "大阪府": { lat: "34.6937", lng: "135.5022" },
  "兵庫県": { lat: "34.6913", lng: "135.1830" },
  "奈良県": { lat: "34.6851", lng: "135.8325" },
  "和歌山県": { lat: "34.2261", lng: "135.1675" },
  "鳥取県": { lat: "35.5036", lng: "134.2381" },
  "島根県": { lat: "35.4723", lng: "133.0505" },
  "岡山県": { lat: "34.6617", lng: "133.9344" },
  "広島県": { lat: "34.3963", lng: "132.4596" },
  "山口県": { lat: "34.1858", lng: "131.4706" },
  "徳島県": { lat: "34.0657", lng: "134.5593" },
  "香川県": { lat: "34.3400", lng: "134.0434" },
  "愛媛県": { lat: "33.8417", lng: "132.7657" },
  "高知県": { lat: "33.5597", lng: "133.5311" },
  "福岡県": { lat: "33.5902", lng: "130.4017" },
  "佐賀県": { lat: "33.2494", lng: "130.2988" },
  "長崎県": { lat: "32.7448", lng: "129.8737" },
  "熊本県": { lat: "32.7898", lng: "130.7417" },
  "大分県": { lat: "33.2382", lng: "131.6126" },
  "宮崎県": { lat: "31.9111", lng: "131.4239" },
  "鹿児島県": { lat: "31.5602", lng: "130.5581" },
  "沖縄県": { lat: "26.2124", lng: "127.6792" },
};
