import { NextResponse } from "next/server";
import { getKernel } from "@/lib/kernel/get-kernel";

export async function POST(request: Request) {
  const body = await request.json();

  const text = typeof body.text === "string" ? body.text : "";

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Text is required." },
      { status: 400 }
    );
  }

  const forge = getKernel();
  const result = await forge.capture(text);

  return NextResponse.json(result);
}