import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ハラール屋について",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ハラール屋について</h1>

      <div className="bg-[#1B6B2E]/5 rounded-2xl p-6 mb-8 border border-[#1B6B2E]/20">
        <p className="text-[#1B6B2E] font-semibold text-lg mb-2">🌙 私たちのミッション</p>
        <p className="text-gray-700 leading-relaxed">
          日本在住のムスリムの皆様が、安心してハラール認証済みの食品・日用品を購入できる環境を提供することが私たちの使命です。
        </p>
      </div>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">ハラール認証へのこだわり</h2>
          <p>
            当店では、すべての商品においてハラール認証を確認した上で販売しています。
            ハラール認証機関が発行した証明書を確認し、安心してお買い物いただける体制を整えています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">多言語対応</h2>
          <p>
            日本語・トルコ語・英語の3言語でサービスを提供し、
            様々な国籍のムスリムの皆様に使いやすいサービスを目指しています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">取り扱い商品</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>ハラールミート（牛・鶏・羊など）</li>
            <li>ハラール認証済み魚介類</li>
            <li>スパイス・調味料</li>
            <li>米・穀物</li>
            <li>野菜・果物</li>
            <li>冷凍食品</li>
            <li>ハラール飲料</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">会社情報</h2>
          <dl className="space-y-1">
            <div className="flex gap-3">
              <dt className="text-gray-500 w-24 shrink-0">所在地</dt>
              <dd>〒490-1111 愛知県あま市木田西新五領46-1</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-gray-500 w-24 shrink-0">メール</dt>
              <dd>support@halaliya.com</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
