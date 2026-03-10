/**
 * ハラール屋 シードデータ
 * 実行: bunx ts-node prisma/seed.ts
 *      または: bun prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータ投入開始...");

  // ━━ カテゴリ ━━
  const categoryData = [
    { nameJa: "ハラールミート",  nameTr: "Helal Et",         nameEn: "Halal Meat",       slug: "halal-meat",     icon: "🥩", order: 1 },
    { nameJa: "魚・海鮮",        nameTr: "Balık & Deniz",    nameEn: "Fish & Seafood",    slug: "fish-seafood",   icon: "🐟", order: 2 },
    { nameJa: "スパイス・調味料", nameTr: "Baharat",          nameEn: "Spices",            slug: "spices",         icon: "🌶️", order: 3 },
    { nameJa: "米・穀物",        nameTr: "Pirinç & Tahıl",   nameEn: "Rice & Grains",     slug: "rice-grains",    icon: "🍚", order: 4 },
    { nameJa: "野菜・果物",      nameTr: "Sebze & Meyve",    nameEn: "Vegetables",        slug: "vegetables",     icon: "🥦", order: 5 },
    { nameJa: "冷凍食品",        nameTr: "Dondurulmuş",      nameEn: "Frozen Food",       slug: "frozen",         icon: "🧊", order: 6 },
    { nameJa: "飲料・乳製品",    nameTr: "İçecek & Süt",     nameEn: "Drinks & Dairy",    slug: "drinks-dairy",   icon: "🥛", order: 7 },
    { nameJa: "お菓子・デザート", nameTr: "Tatlı & Atıştır", nameEn: "Snacks & Desserts", slug: "snacks",         icon: "🍬", order: 8 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameJa: cat.nameJa, nameTr: cat.nameTr, nameEn: cat.nameEn, order: cat.order },
      create: {
        nameJa: cat.nameJa,
        nameTr: cat.nameTr,
        nameEn: cat.nameEn,
        slug: cat.slug,
        order: cat.order,
      },
    });
    categories[cat.slug] = created;
    console.log(`  ✓ カテゴリ: ${cat.nameJa}`);
  }

  // ━━ 商品サンプル ━━
  const productData = [
    // ハラールミート
    {
      nameJa: "ハラール牛ひき肉 500g",
      nameTr: "Helal Dana Kıyma 500g",
      nameEn: "Halal Ground Beef 500g",
      slug: "halal-ground-beef-500g",
      descJa: "トルコ産ハラール認証済み牛ひき肉。コフテやハンバーグに最適。",
      price: 980,
      taxRate: 8,
      stock: 50,
      isHalal: true,
      categorySlug: "halal-meat",
    },
    {
      nameJa: "ハラール鶏もも肉 1kg",
      nameTr: "Helal Tavuk But 1kg",
      nameEn: "Halal Chicken Thigh 1kg",
      slug: "halal-chicken-thigh-1kg",
      descJa: "ハラール認証済み鶏もも肉。唐揚げ・カレーに。",
      price: 780,
      taxRate: 8,
      stock: 80,
      isHalal: true,
      categorySlug: "halal-meat",
    },
    {
      nameJa: "ラム肉スライス 300g",
      nameTr: "Kuzu Eti Dilim 300g",
      nameEn: "Lamb Slices 300g",
      slug: "lamb-slices-300g",
      descJa: "本場トルコスタイルのラム肉スライス。ケバブに最適。",
      price: 1480,
      taxRate: 8,
      stock: 30,
      isHalal: true,
      categorySlug: "halal-meat",
    },
    // スパイス
    {
      nameJa: "トルコクミン（クミン）30g",
      nameTr: "Türk Kimyonu 30g",
      nameEn: "Turkish Cumin 30g",
      slug: "turkish-cumin-30g",
      descJa: "トルコ産最高品質のクミン。コフテ・キョフテ作りに欠かせないスパイス。",
      price: 480,
      taxRate: 8,
      stock: 100,
      isHalal: true,
      categorySlug: "spices",
    },
    {
      nameJa: "ビベル サルチャス (赤唐辛子ペースト) 300g",
      nameTr: "Biber Salçası 300g",
      nameEn: "Red Pepper Paste 300g",
      slug: "biber-salcasi-300g",
      descJa: "トルコ料理の定番、赤唐辛子ペースト。スープや煮込みに。",
      price: 680,
      taxRate: 8,
      stock: 60,
      isHalal: true,
      categorySlug: "spices",
    },
    {
      nameJa: "ザータル ミックス 50g",
      nameTr: "Za'tar Karışımı 50g",
      nameEn: "Za'atar Mix 50g",
      slug: "zaatar-mix-50g",
      descJa: "タイム・ゴマ・スマックのブレンドスパイス。パンやオリーブオイルとの相性抜群。",
      price: 580,
      taxRate: 8,
      stock: 70,
      isHalal: true,
      categorySlug: "spices",
    },
    // 米
    {
      nameJa: "バスマティライス 2kg",
      nameTr: "Basmati Pirinç 2kg",
      nameEn: "Basmati Rice 2kg",
      slug: "basmati-rice-2kg",
      descJa: "インド産バスマティライス。ピラフ・ビリヤニに。ハラール認証済み。",
      price: 1280,
      taxRate: 8,
      stock: 40,
      isHalal: true,
      categorySlug: "rice-grains",
    },
    // 飲料
    {
      nameJa: "チャイ（トルコ紅茶）100g",
      nameTr: "Türk Çayı 100g",
      nameEn: "Turkish Black Tea 100g",
      slug: "turkish-black-tea-100g",
      descJa: "リゼ産本格トルコ紅茶。細長いグラスで楽しむ伝統の一杯。",
      price: 880,
      taxRate: 8,
      stock: 90,
      isHalal: true,
      categorySlug: "drinks-dairy",
    },
    // お菓子
    {
      nameJa: "ロクム（トルコ菓子）200g",
      nameTr: "Lokum 200g",
      nameEn: "Turkish Delight 200g",
      slug: "turkish-delight-200g",
      descJa: "薔薇水風味のトルコ伝統菓子ロクム。ピスタチオ入り。",
      price: 1080,
      taxRate: 8,
      stock: 45,
      isHalal: true,
      categorySlug: "snacks",
    },
    {
      nameJa: "ハルヴァ（ゴマ菓子）300g",
      nameTr: "Helva 300g",
      nameEn: "Sesame Halvah 300g",
      slug: "sesame-halvah-300g",
      descJa: "濃厚なゴマペースト菓子。プレーン・カカオ2種。",
      price: 1380,
      taxRate: 8,
      stock: 35,
      isHalal: true,
      categorySlug: "snacks",
    },
  ];

  for (const p of productData) {
    const { categorySlug, ...rest } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        nameJa: rest.nameJa,
        nameTr: rest.nameTr,
        nameEn: rest.nameEn,
        price: rest.price,
        stock: rest.stock,
      },
      create: {
        ...rest,
        categoryId: categories[categorySlug]?.id,
        isActive: true,
      },
    });
    console.log(`  ✓ 商品: ${p.nameJa} (¥${p.price})`);
  }

  console.log("\n✅ シード完了！");
  console.log(`   カテゴリ: ${categoryData.length}件`);
  console.log(`   商品: ${productData.length}件`);
}

main()
  .catch((e) => {
    console.error("❌ エラー:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
