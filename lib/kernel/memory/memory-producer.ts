import type { MemoryAssertion } from "./types";

export interface MemoryProducer<TInput> {
  produce(input: TInput): MemoryAssertion[];
}