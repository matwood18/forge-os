import { NextResponse } from "next/server";

import { getKernel } from "@/lib/kernel/get-kernel";

export async function GET() {
  const forge = getKernel();

  const people = await forge.people();

  return NextResponse.json({
    people,
  });
}