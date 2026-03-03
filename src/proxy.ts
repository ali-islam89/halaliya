import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route: check for admin session cookie
  const adminPaths = routing.locales.map((l) => `/${l}/admin`);
  const isAdminPath = adminPaths.some(
    (ap) => pathname === ap || pathname.startsWith(ap + "/")
  );

  if (isAdminPath) {
    const adminSession = request.cookies.get("admin_session");
    if (!adminSession) {
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}/`)) || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth/login?redirect=admin`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
