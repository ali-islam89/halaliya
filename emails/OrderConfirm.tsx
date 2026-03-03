import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface OrderConfirmEmailProps {
  orderNumber: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: "CREDIT" | "PAYPAY" | "COD";
  shippingAddress: {
    name: string;
    postal: string;
    address: string;
  };
}

const PAYMENT_LABELS = {
  CREDIT: "クレジットカード",
  PAYPAY: "PayPay",
  COD: "代金引換",
};

export default function OrderConfirmEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  tax,
  shipping,
  codFee,
  total,
  paymentMethod,
  shippingAddress,
}: OrderConfirmEmailProps) {
  return (
    <Html lang="ja">
      <Head />
      <Preview>【ハラール屋】ご注文確認 {orderNumber}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "24px" }}>
          {/* Header */}
          <Section style={{ backgroundColor: "#1B6B2E", padding: "20px", borderRadius: "12px 12px 0 0" }}>
            <Heading style={{ color: "white", margin: 0, fontSize: "20px" }}>
              ハラール屋
            </Heading>
            <Text style={{ color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontSize: "12px" }}>
              halaliya.com
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: "white", padding: "24px", borderRadius: "0 0 12px 12px" }}>
            <Heading as="h2" style={{ color: "#1a1a1a", fontSize: "18px" }}>
              ご注文ありがとうございます
            </Heading>
            <Text style={{ color: "#4b5563" }}>
              {customerName} 様、ご注文を受け付けました。
            </Text>

            <Hr />

            <Text style={{ fontSize: "13px", color: "#6b7280" }}>注文番号</Text>
            <Text style={{ fontSize: "18px", fontWeight: "bold", color: "#1B6B2E", marginTop: "4px" }}>
              {orderNumber}
            </Text>

            <Hr />

            <Heading as="h3" style={{ fontSize: "15px", color: "#1a1a1a" }}>注文内容</Heading>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={{ margin: 0, fontSize: "14px" }}>
                    {item.name} × {item.quantity}
                  </Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ margin: 0, fontSize: "14px" }}>
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr />

            <Row>
              <Column><Text style={{ margin: "2px 0", fontSize: "13px", color: "#6b7280" }}>小計（税抜）</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: "2px 0", fontSize: "13px" }}>¥{subtotal.toLocaleString()}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ margin: "2px 0", fontSize: "13px", color: "#6b7280" }}>消費税</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: "2px 0", fontSize: "13px" }}>¥{tax.toLocaleString()}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ margin: "2px 0", fontSize: "13px", color: "#6b7280" }}>送料</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: "2px 0", fontSize: "13px" }}>{shipping === 0 ? "無料" : `¥${shipping.toLocaleString()}`}</Text></Column>
            </Row>
            {codFee > 0 && (
              <Row>
                <Column><Text style={{ margin: "2px 0", fontSize: "13px", color: "#6b7280" }}>代引き手数料</Text></Column>
                <Column style={{ textAlign: "right" }}><Text style={{ margin: "2px 0", fontSize: "13px" }}>¥{codFee.toLocaleString()}</Text></Column>
              </Row>
            )}
            <Row style={{ borderTop: "2px solid #e5e7eb", marginTop: "8px", paddingTop: "8px" }}>
              <Column><Text style={{ margin: 0, fontWeight: "bold" }}>合計</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: 0, fontWeight: "bold", color: "#1B6B2E", fontSize: "18px" }}>
                  ¥{total.toLocaleString()}
                </Text>
              </Column>
            </Row>

            <Hr />

            <Text style={{ fontSize: "13px", color: "#6b7280" }}>
              お支払い方法: {PAYMENT_LABELS[paymentMethod]}
            </Text>
            <Text style={{ fontSize: "13px", color: "#6b7280" }}>
              配送先: 〒{shippingAddress.postal} {shippingAddress.address} {shippingAddress.name} 様
            </Text>
          </Section>

          {/* Footer */}
          <Text style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "16px" }}>
            当店はハラール認証済み商品のみ取り扱っています。<br />
            © 2026 ハラール屋 halaliya.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
