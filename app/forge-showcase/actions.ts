// app/forge-showcase/actions.ts
"use server";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import type { KernelExecution } from "@/lib/kernel/execution";

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

  return {
    execution,
  };
}