import { NextResponse } from "next/server";

export async function GET() {
  const data = { message: "Hello from API" };
  return NextResponse.json(data); // Sends JSON with content-type automatically
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}
