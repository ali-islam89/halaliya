"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Moon, Star } from "lucide-react";
import { PREFECTURES, PREFECTURE_COORDS } from "@/lib/utils";
import type { PrayerTimes } from "@/types";

export default function PrayerTimesWidget() {
  const t = useTranslations("prayer");
  const [prefecture, setPrefecture] = useState("東京都");
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" }));
  }, []);

  useEffect(() => {
    const coords = PREFECTURE_COORDS[prefecture];
    if (!coords) return;
    setLoading(true);
    const now = new Date();
    fetch(
      `/api/prayer-times?lat=${coords.lat}&lng=${coords.lng}&year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}`
    )
      .then((r) => r.json())
      .then((data) => { if (data.timings) setTimes(data.timings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [prefecture]);

  const prayerKeys: (keyof PrayerTimes)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const labelMap: Record<keyof PrayerTimes, string> = {
    Fajr: t("fajr"), Sunrise: t("sunrise"), Dhuhr: t("dhuhr"),
    Asr: t("asr"), Maghrib: t("maghrib"), Isha: t("isha"),
  };

  // 次の礼拝を強調
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nextPrayer: keyof PrayerTimes | null = null;
  if (times) {
    for (const key of prayerKeys) {
      const t_str = times[key]?.split(" ")[0];
      if (!t_str) continue;
      const [h, m] = t_str.split(":").map(Number);
      if (h * 60 + m > nowMinutes) { nextPrayer = key; break; }
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#1A3A5C", boxShadow: "0 2px 12px rgba(26,58,92,0.3)" }}
    >
      {/* ヘッダー */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(200,150,30,0.4)" }}
      >
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4" style={{ color: "#C8961E" }} />
          <h3 className="font-semibold text-sm text-white">{t("title")}</h3>
        </div>
        <Star className="h-3 w-3" style={{ color: "#C8961E", opacity: 0.7 }} />
      </div>

      <div className="px-4 py-3">
        {/* 都道府県選択 */}
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="w-full text-white text-xs rounded-md px-2 py-1.5 mb-2.5 focus:outline-none"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(200,150,30,0.4)",
          }}
        >
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref} style={{ background: "#1A3A5C", color: "white" }}>
              {pref}
            </option>
          ))}
        </select>

        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
          {t("today")}: {date}
        </p>

        {/* 礼拝時間リスト */}
        {loading ? (
          <p className="text-xs text-center py-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            読み込み中...
          </p>
        ) : times ? (
          <div className="space-y-1.5">
            {prayerKeys.map((key) => {
              const isNext = key === nextPrayer;
              return (
                <div
                  key={key}
                  className="flex justify-between items-center text-xs rounded-md px-2 py-1"
                  style={isNext ? {
                    background: "rgba(200,150,30,0.2)",
                    border: "1px solid rgba(200,150,30,0.5)",
                  } : {}}
                >
                  <span style={{ color: isNext ? "#C8961E" : "rgba(255,255,255,0.7)" }}>
                    {isNext && "▶ "}{labelMap[key]}
                  </span>
                  <span
                    className="font-medium tabular-nums"
                    style={{ color: isNext ? "#C8961E" : "white" }}
                  >
                    {times[key]?.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-center py-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            データなし
          </p>
        )}
      </div>

      {/* フッター装飾 */}
      <div
        className="px-4 py-1.5 text-center text-[10px]"
        style={{ background: "rgba(0,0,0,0.2)", color: "rgba(200,150,30,0.6)" }}
      >
        Aladhan API
      </div>
    </div>
  );
}
