// lib/demo/interactive/types.ts
import type { DemoSession } from "../session";

export type InteractiveDemoInputValidationResult =
  | {
      ok: true;
      input: string;
    }
  | {
      ok: false;
      message: string;
    };

export type InteractiveDemoRunResult =
  | {
      ok: true;
      session: DemoSession;
    }
  | {
      ok: false;
      message: string;
    };