"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useWishlist(userId?: string) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    async function fetchWishlist() {
      const { data } = await supabase
        .from("wishlist_items")
        .select("productId")
        .eq("userId", userId);
      if (data) {
        setWishlistIds(new Set(data.map((d: { productId: string }) => d.productId)));
      }
    }
    fetchWishlist();
  }, [userId]);

  const toggle = async (productId: string) => {
    if (!userId) return;
    setLoading(true);

    const isWishlisted = wishlistIds.has(productId);
    if (isWishlisted) {
      await supabase
        .from("wishlist_items")
        .delete()
        .eq("userId", userId)
        .eq("productId", productId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    } else {
      await supabase
        .from("wishlist_items")
        .insert({ userId, productId });
      setWishlistIds((prev) => new Set([...prev, productId]));
    }
    setLoading(false);
  };

  return { wishlistIds, toggle, loading };
}
