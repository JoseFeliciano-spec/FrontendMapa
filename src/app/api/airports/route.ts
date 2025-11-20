// app/api/airports/route.ts
import { NextResponse } from "next/server";
const API = "https://api.aviationstack.com/v1/airports";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = searchParams.get("limit") || "10";
  const offset = searchParams.get("offset") || "0";

  const params = new URLSearchParams({
    access_key: process.env.AVIATIONSTACK_KEY || "",
    limit,
    offset,
  });
  if (q) params.set("search", q); // si vacío, no enviar 'search'

  const r = await fetch(`${API}?${params.toString()}`, {
    next: { revalidate: 30 },
  });
  const data = await r.json();
  return NextResponse.json(data);
}
