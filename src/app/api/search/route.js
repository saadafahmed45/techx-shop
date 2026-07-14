import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const res = await fetch(`${API}/products?limit=200`, { next: { revalidate: 60 } });
    if (!res.ok) return NextResponse.json({ error: "Search failed" }, { status: 502 });

    const json = await res.json();
    const list = Array.isArray(json) ? json : (json?.data || []);

    const results = q
      ? list.filter((p) =>
          p.title?.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        )
      : list;

    return NextResponse.json(
      { results, total: results.length },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch {
    return NextResponse.json({ error: "Search service unavailable" }, { status: 500 });
  }
}
