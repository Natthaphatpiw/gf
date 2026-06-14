import { NextResponse } from "next/server";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  type ItemType,
} from "@/lib/store";
import { getSessionCustomerId } from "@/lib/session-server";

const TYPES: ItemType[] = ["program", "service", "menu", "package"];

async function parseItem(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const itemType = body.itemType as ItemType;
  const itemId = String(body.itemId ?? "").trim();
  if (!TYPES.includes(itemType) || !itemId) return null;
  return { itemType, itemId };
}

export async function GET() {
  const id = await getSessionCustomerId();
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const items = await getFavorites(id);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const id = await getSessionCustomerId();
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const item = await parseItem(req);
  if (!item) return NextResponse.json({ error: "bad_item" }, { status: 400 });
  await addFavorite(id, item.itemType, item.itemId);
  return NextResponse.json({ items: await getFavorites(id) });
}

export async function DELETE(req: Request) {
  const id = await getSessionCustomerId();
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const item = await parseItem(req);
  if (!item) return NextResponse.json({ error: "bad_item" }, { status: 400 });
  await removeFavorite(id, item.itemType, item.itemId);
  return NextResponse.json({ items: await getFavorites(id) });
}
