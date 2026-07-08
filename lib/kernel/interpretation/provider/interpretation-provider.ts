import type { Event } from "@/lib/domain";
import type { SemanticSignal } from "../interpretation-record";

export type InterpretationProviderResult = {
  signals: SemanticSignal[];
};

export interface InterpretationProvider {
  interpret(event: Event): Promise<InterpretationProviderResult>;
}
