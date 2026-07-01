import { ForgeKernel } from "./forge-kernel";

let kernel: ForgeKernel | null = null;

export function getKernel() {
  if (!kernel) {
    kernel = new ForgeKernel();
  }

  return kernel;
}