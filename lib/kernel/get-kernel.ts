import { createKernel } from "./create-kernel";
import type { ForgeKernel } from "./forge-kernel";

let kernel: ForgeKernel | null = null;

export function getKernel() {
  if (!kernel) {
    kernel = createKernel();
  }

  return kernel;
}