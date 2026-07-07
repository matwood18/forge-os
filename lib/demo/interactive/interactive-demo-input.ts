// lib/demo/interactive/interactive-demo-input.ts
import type { InteractiveDemoInputValidationResult } from "./types";

const MAX_INTERACTIVE_DEMO_INPUT_LENGTH = 2_000;

export function validateInteractiveDemoInput(
  input: unknown
): InteractiveDemoInputValidationResult {
  if (typeof input !== "string") {
    return {
      ok: false,
      message: "Forge needs text input before it can run.",
    };
  }

  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      ok: false,
      message: "Enter something for Forge to process.",
    };
  }

  if (trimmedInput.length > MAX_INTERACTIVE_DEMO_INPUT_LENGTH) {
    return {
      ok: false,
      message: `Keep demo input under ${MAX_INTERACTIVE_DEMO_INPUT_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    input: trimmedInput,
  };
}