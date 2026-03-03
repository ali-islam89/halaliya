import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat") || "35.6762";
  const lng = searchParams.get("lng") || "139.6503";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const month = searchParams.get("month") || String(new Date().getMonth() + 1);
  const day = searchParams.get("day") || String(new Date().getDate());

  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=3`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch prayer times" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({
      timings: data.data?.timings,
      date: data.data?.date,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
