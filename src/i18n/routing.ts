import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ja", "tr", "en"],
  defaultLocale: "ja",
  localePrefix: "always",
});
