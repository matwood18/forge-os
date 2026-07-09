
export const runtime = "nodejs";
// app/api/forge-showcase/execute/route.ts
import { NextResponse } from "next/server";

import {
  executiveConcernCoordinator,
  executiveConcernProjector,
  executiveSessionStore,
} from "@/lib/executive";
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

    const concernProjection = executiveConcernProjector.project({
      attention: projection.executiveAttention,
      output: projection.executiveOutput,
    });

    executiveConcernCoordinator.coordinate({
      projection: concernProjection,
    });

    executiveSessionStore.replace({
      projection,
      createdAt: new Date(),
    });

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
