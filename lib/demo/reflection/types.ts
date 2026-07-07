// lib/demo/reflection/types.ts
import type { ReflectionRecord } from "@/lib/kernel/reflection";

export type ReflectionInspectorItem = {
  id: string;
  executionId: string;
  kind: ReflectionRecord["kind"];
  severity: ReflectionRecord["severity"];
  title: string;
  summary: string;
  target?: ReflectionRecord["target"];
  createdAt: Date;
};

export type ReflectionInspector = {
  id: string;
  items: ReflectionInspectorItem[];
};