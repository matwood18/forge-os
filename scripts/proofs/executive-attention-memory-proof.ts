import {
  InMemoryAttentionMemoryStore,
} from "@/lib/executive/attention-memory";

const store = new InMemoryAttentionMemoryStore();

const surfacedRecord = {
  id: "attention-1",
  subjectKey: "insurance-issue",
  state: "surfaced" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const quietRecord = {
  id: "attention-2",
  subjectKey: "old-photo-organization",
  state: "quiet" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

store.remember(surfacedRecord);
store.remember(quietRecord);

const surfaced = store.find("insurance-issue");
const quiet = store.find("old-photo-organization");

if (!surfaced) {
  throw new Error("Surfaced attention was not remembered");
}

if (surfaced.state !== "surfaced") {
  throw new Error("Surfaced attention state was not preserved");
}

if (!quiet) {
  throw new Error("Quiet attention was not remembered");
}

if (quiet.state !== "quiet") {
  throw new Error("Quiet attention state was not preserved");
}

if (store.all().length !== 2) {
  throw new Error("Attention memory did not retain expected records");
}

store.clear();

if (store.all().length !== 0) {
  throw new Error("Attention memory did not clear safely");
}

console.log("Executive attention memory proof passed.");

console.log(
  JSON.stringify(
    {
      surfacedState: surfaced.state,
      quietState: quiet.state,
      rememberedCount: 2,
      clearedSafely: store.all().length === 0,
    },
    null,
    2
  )
);
