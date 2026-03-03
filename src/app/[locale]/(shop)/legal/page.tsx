import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

      <div className="space-y-6">
        {[
          { label: "販売業者", value: "ハラール屋（halaliya.com）" },
          { label: "運営責任者", value: "（代表者名）" },
          { label: "所在地", value: "〒490-1111 愛知県あま市木田西新五領46-1" },
          { label: "電話番号", value: "お問い合わせフォームよりご連絡ください" },
          { label: "メールアドレス", value: "support@halaliya.com" },
          { label: "販売価格", value: "各商品ページに記載（税込価格）" },
          { label: "送料", value: "税抜10,000円以上：送料無料 / 税抜10,000円未満：¥800（全国一律）" },
          { label: "支払い方法", value: "クレジットカード（Visa・Mastercard・JCB等）、PayPay、代金引換" },
          { label: "代金引換手数料", value: "¥330（購入者負担）" },
          { label: "支払い時期", value: "クレジットカード・PayPay：注文時決済 / 代金引換：配送時決済" },
          { label: "商品の引渡し時期", value: "ご注文後3〜7営業日以内に発送（在庫状況により変動）" },
          { label: "返品・交換", value: "商品到着後7日以内に限り、未開封・未使用品の返品を承ります。\n食品の性質上、お客様都合による返品はお受けできません。\n商品の不備・破損があった場合は当社負担にて対応いたします。" },
          { label: "配送業者", value: "ヤマト運輸・佐川急便（いずれか）" },
          { label: "注文のキャンセル", value: "発送前のご注文はキャンセルが可能です。発送後のキャンセルはお受けできません。" },
        ].map(({ label, value }) => (
          <div key={label} className="border-b border-gray-100 pb-4">
            <dt className="text-sm font-semibold text-gray-900 mb-1">{label}</dt>
            <dd className="text-sm text-gray-600 whitespace-pre-line">{value}</dd>
          </div>
        ))}
      </div>

      <div id="privacy" className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">プライバシーポリシー</h2>
        <div className="prose prose-sm text-gray-600 space-y-4">
          <p>当店（ハラール屋）は、お客様の個人情報を適切に管理・保護することを重要な責務と考え、以下の方針に従い個人情報を取り扱います。</p>

          <h3 className="font-semibold text-gray-900 mt-4">収集する情報</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>氏名・住所・電話番号・メールアドレス（注文・会員登録時）</li>
            <li>購入履歴・閲覧履歴（サービス改善目的）</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mt-4">利用目的</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>商品の発送・決済処理</li>
            <li>注文確認・発送通知メールの送信</li>
            <li>カスタマーサポート</li>
            <li>サービスの改善・新サービスのご案内</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mt-4">第三者への提供</h3>
          <p>配送業者・決済処理会社への情報提供を除き、お客様の同意なく個人情報を第三者に提供することはありません。</p>

          <h3 className="font-semibold text-gray-900 mt-4">お問い合わせ</h3>
          <p>個人情報に関するお問い合わせは support@halaliya.com までご連絡ください。</p>
        </div>
      </div>
    </div>
  );
}
