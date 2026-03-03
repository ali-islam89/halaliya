"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "受付" },
  { value: "PAYMENT_PENDING", label: "支払い待ち" },
  { value: "PAID", label: "支払い完了" },
  { value: "PROCESSING", label: "準備中" },
  { value: "SHIPPED", label: "発送済み" },
  { value: "DELIVERED", label: "配達完了" },
  { value: "CANCELLED", label: "キャンセル" },
  { value: "REFUNDED", label: "返金済み" },
];

interface Props {
  orderId: string;
  currentStatus: string;
  trackingNumber?: string | null;
}

export default function OrderActions({ orderId, currentStatus, trackingNumber }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(trackingNumber || "");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber: tracking || null }),
      });
      setOpen(false);
      router.refresh();
    } catch {}
    setSaving(false);
  };

  if (!open) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        編集
      </Button>
    );
  }

  return (
    <div className="flex items-end gap-2 min-w-[280px]">
      <div className="flex-1 space-y-1.5">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="h-7 text-xs"
          placeholder="追跡番号"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
      </div>
      <div className="flex gap-1">
        <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 px-2 text-xs">
          {saving ? "..." : "保存"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="h-7 px-2 text-xs">
          ×
        </Button>
      </div>
    </div>
  );
}
