"use server";

import { executiveSessionStore } from "@/lib/executive";
import type { KernelExecution } from "@/lib/kernel/execution";
import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import { buildShowcaseProjection } from "@/lib/showcase";

export type ForgeShowcaseExecutionResult = {
  execution: KernelExecution;
};

export async function executeForgeShowcaseInput(
  input: string
): Promise<ForgeShowcaseExecutionResult> {
  const normalizedInput = input.trim();

  const kernel = new ForgeKernel();
  const execution = await kernel.execute(
    normalizedInput || "Jess is mad at me for not contacting insurance."
  );

  const projection = await buildShowcaseProjection(execution);

  executiveSessionStore.replace({
    projection,
    createdAt: new Date(),
  });

  return {
    execution,
  };
}
