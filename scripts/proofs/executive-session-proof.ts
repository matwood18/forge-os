import { FileExecutiveSessionStore } from "@/lib/executive";
import type { ShowcaseProjection } from "@/lib/showcase";

function fakeProjection(id: string): ShowcaseProjection {
  return {
    executionId: id,
    input: `input-${id}`,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    totalSteps: 0,
    stages: [],
    understanding: {
      people: {
        title: "People",
        summary: "",
        items: [],
        emptyState: "",
      },
      obligations: {
        title: "Obligations",
        summary: "",
        items: [],
        emptyState: "",
      },
      emotions: {
        title: "Emotions",
        summary: "",
        items: [],
        emptyState: "",
      },
      possibleRelations: {
        title: "Possible relations",
        summary: "",
        items: [],
        emptyState: "",
      },
    },
    executiveBrief: {
      title: "Brief",
      summary: "",
      priorities: [],
      createdAt: new Date(),
    },
    executiveAttention: {
      attention: [],
      generatedAt: new Date(),
    },
    executiveOutput: {
      suggestions: [],
      clarifications: [],
      summary: {
        suggestionCount: 0,
        clarificationCount: 0,
        hasActionableSuggestions: false,
        hasPendingClarifications: false,
      },
      generatedAt: new Date(),
    },
    narrative: {
      title: "Narrative",
      summary: "",
      sections: {
        noticed: {
          title: "",
          statement: "",
          evidence: [],
        },
        significance: {
          title: "",
          statement: "",
          evidence: [],
        },
        inference: {
          title: "",
          statement: "",
          evidence: [],
        },
        recommendation: {
          title: "",
          statement: "",
          evidence: [],
        },
        authorization: {
          title: "",
          statement: "",
          evidence: [],
        },
        outcome: {
          title: "",
          statement: "",
          evidence: [],
        },
      },
    },
  };
}

const store = new FileExecutiveSessionStore();
store.clear();

if (store.current() !== undefined) {
  throw new Error("Expected empty store to have no current session.");
}

const firstProjection = fakeProjection("first");
store.replace({
  projection: firstProjection,
  createdAt: new Date(),
});

if (store.current()?.projection.executionId !== "first") {
  throw new Error("Expected store to return first session.");
}

const secondProjection = fakeProjection("second");
store.replace({
  projection: secondProjection,
  createdAt: new Date(),
});

if (store.current()?.projection.executionId !== "second") {
  throw new Error("Expected replace to overwrite the current session.");
}

if (store.current()?.projection === firstProjection) {
  throw new Error("Expected previous projection to be replaced.");
}

store.clear();

if (store.current() !== undefined) {
  throw new Error("Expected clear to remove current session.");
}

console.log("Executive session proof passed.");
console.log({
  emptyInitially: true,
  replacementWorks: true,
  clearWorks: true,
});
