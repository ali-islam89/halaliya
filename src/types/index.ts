export type Locale = "ja" | "tr" | "en";

export type Role = "CUSTOMER" | "STAFF" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "CREDIT" | "PAYPAY" | "COD";

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  order: number;
}

export interface Category {
  id: string;
  nameJa: string;
  nameTr?: string | null;
  nameEn?: string | null;
  slug: string;
  parentId?: string | null;
  order: number;
  imageUrl?: string | null;
  children?: Category[];
}

export interface Product {
  id: string;
  nameJa: string;
  nameTr?: string | null;
  nameEn?: string | null;
  slug: string;
  descJa?: string | null;
  descTr?: string | null;
  descEn?: string | null;
  price: number;
  taxRate: number;
  stock: number;
  weight?: number | null;
  isHalal: boolean;
  isActive: boolean;
  categoryId?: string | null;
  category?: Category | null;
  images: ProductImage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  price: number;
  taxRate: number;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotalExcl: () => number;
  totalTax: () => number;
  totalExcl: () => number;
}

export interface ShippingAddress {
  name: string;
  email?: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: number;
  itemCount: number;
  createdAt: Date | string;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string | null;
  titleJa?: string | null;
  titleTr?: string | null;
  titleEn?: string | null;
  order: number;
  isActive: boolean;
}
