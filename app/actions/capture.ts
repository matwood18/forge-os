"use server";

import { ForgeKernel } from "@/lib/kernel";

export async function captureAction(text: string) {
  const forge = new ForgeKernel();

  return forge.capture(text);
}