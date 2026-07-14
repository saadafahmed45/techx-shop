import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API}/orders?limit=200`, { next: { revalidate: 30 } });
    if (!res.ok) return NextResponse.json({ error: "Failed to fetch orders" }, { status: 502 });

    const json = await res.json();
    const list = Array.isArray(json) ? json : (json?.data || []);

    const found = list.find((item) => {
      const fullId = item._id?.toLowerCase() || "";
      const shortId = item._id?.slice(-6).toLowerCase() || "";
      const q = query.toLowerCase();
      return fullId === q || shortId === q || fullId.includes(q);
    });

    if (!found) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(found, {
      headers: { "Cache-Control": "private, max-age=10" },
    });
  } catch {
    return NextResponse.json({ error: "Tracking service unavailable" }, { status: 500 });
  }
}
