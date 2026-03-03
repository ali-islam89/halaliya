"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Moon } from "lucide-react";
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
      .then((data) => {
        if (data.timings) setTimes(data.timings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [prefecture]);

  const prayerKeys: (keyof PrayerTimes)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const labelMap: Record<keyof PrayerTimes, string> = {
    Fajr: t("fajr"),
    Sunrise: t("sunrise"),
    Dhuhr: t("dhuhr"),
    Asr: t("asr"),
    Maghrib: t("maghrib"),
    Isha: t("isha"),
  };

  return (
    <div className="bg-[#1B6B2E] text-white rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Moon className="h-4 w-4 text-[#C8961E]" />
        <h3 className="font-semibold text-sm">{t("title")}</h3>
      </div>

      <select
        value={prefecture}
        onChange={(e) => setPrefecture(e.target.value)}
        className="w-full bg-white/20 text-white text-xs rounded-md px-2 py-1.5 mb-3 border border-white/30 focus:outline-none focus:ring-1 focus:ring-white/50"
      >
        {PREFECTURES.map((pref) => (
          <option key={pref} value={pref} className="text-gray-900">
            {pref}
          </option>
        ))}
      </select>

      <p className="text-xs text-white/70 mb-2">{t("today")}: {date}</p>

      {loading ? (
        <p className="text-xs text-white/70 text-center py-2">読み込み中...</p>
      ) : times ? (
        <div className="space-y-1">
          {prayerKeys.map((key) => (
            <div key={key} className="flex justify-between items-center text-xs">
              <span className="text-white/80">{labelMap[key]}</span>
              <span className="font-medium tabular-nums">{times[key]?.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/50 text-center py-2">データなし</p>
      )}
    </div>
  );
}
