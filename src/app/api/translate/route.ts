import { NextRequest, NextResponse } from "next/server";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

export async function POST(request: NextRequest) {
  const { text, sourceLang = "JA", targetLang } = await request.json();

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
  }

  if (!process.env.DEEPL_API_KEY) {
    return NextResponse.json({ error: "DEEPL_API_KEY not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: Array.isArray(text) ? text : [text],
        source_lang: sourceLang,
        target_lang: targetLang.toUpperCase(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `DeepL API error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    const translations = data.translations.map((t: any) => t.text);
    return NextResponse.json({ translations });
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
