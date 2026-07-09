// app/api/forge-showcase/execute/route.ts
import { NextResponse } from "next/server";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";

const defaultInput = "Jess is mad at me for not contacting insurance.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input?: unknown };
    const input =
      typeof body.input === "string" && body.input.trim().length > 0
        ? body.input.trim()
        : defaultInput;

    const kernel = new ForgeKernel();
    const execution = await kernel.execute(input);
    const projection = await buildShowcaseProjection(execution);

    return NextResponse.json({ projection });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Forge could not complete this execution.",
      },
      { status: 500 }
    );
  }
}