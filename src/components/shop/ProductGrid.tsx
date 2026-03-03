import type { Product, Locale } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  locale: Locale;
  wishlistedIds?: Set<string>;
  onWishlistToggle?: (productId: string) => void;
}

export default function ProductGrid({
  products,
  locale,
  wishlistedIds,
  onWishlistToggle,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          wishlisted={wishlistedIds?.has(product.id)}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
