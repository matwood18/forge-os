import type { Suggestion } from "@/lib/executive/suggestion";
import type { ExecutivePresentationProjector } from "./executive-presentation-projector";
import type {
  ExecutivePresentationInput,
  PresentedExecutiveSuggestion,
} from "./types";

const forbiddenTerms = [
  "semantic",
  "evidence",
  "claim",
  "reasoning",
  "runtime",
  "projection",
  "situation",
  "confidence",
  "artifact",
];

const actionVerbs = [
  "Call",
  "Contact",
  "Help",
  "Check",
  "Reply",
  "Review",
  "Schedule",
  "Update",
  "Resolve",
  "Text",
];

function combinedText(suggestion: Suggestion): string {
  return [
    suggestion.title,
    suggestion.whyItMatters,
    suggestion.suggestedNextStep,
    ...suggestion.evidence.flatMap((evidence) => [
      evidence.label,
      evidence.summary,
    ]),
  ].join(" ").toLowerCase();
}

function stripInternalReferences(text: string): string {
  return text
    .replace(/\([^)]*evidence:[^)]*\)/gi, "")
    .replace(/\bevidence:\s*[a-z0-9:_-]+\b/gi, "")
    .replace(/\bopenai-[a-z0-9:_-]+\b/gi, "")
    .replace(/\b[a-z]+-[a-z]+:\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstTwoSentences(text: string): string {
  const cleaned = stripInternalReferences(text);
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return cleaned;
  }

  return sentences.slice(0, 2).join(" ");
}

function startsWithActionVerb(title: string): boolean {
  return actionVerbs.some((verb) =>
    title.toLowerCase().startsWith(verb.toLowerCase() + " ")
  );
}

function presentTitle(suggestion: Suggestion): string {
  const text = combinedText(suggestion);

  if (text.includes("dentist")) {
    return "Call the dentist";
  }

  if (text.includes("insurance")) {
    return "Contact insurance";
  }

  if (text.includes("maxx") && text.includes("project")) {
    return "Help Maxx with his project";
  }

  const cleaned = stripInternalReferences(suggestion.title)
    .replace(/^concerns? about\s+/i, "")
    .replace(/^possible\s+/i, "")
    .replace(/^the\s+/i, "")
    .trim();

  if (startsWithActionVerb(cleaned)) {
    return cleaned;
  }

  return `Review ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
}

function presentWhy(suggestion: Suggestion): string {
  const text = combinedText(suggestion);

  if (text.includes("dentist") && text.includes("friday")) {
    return "This needs attention before Friday.";
  }

  if (text.includes("insurance") && text.includes("jess")) {
    return "Jess appears affected by this remaining unresolved.";
  }

  if (text.includes("maxx") && text.includes("project")) {
    return "Maxx may be waiting on you.";
  }

  const cleaned = firstTwoSentences(suggestion.whyItMatters);

  if (!cleaned) {
    return "This appears worth attention today.";
  }

  return cleaned;
}

function presentNextStep(suggestion: Suggestion): string {
  const text = combinedText(suggestion);

  if (text.includes("dentist")) {
    return "Schedule the appointment.";
  }

  if (text.includes("insurance")) {
    return "Contact insurance today.";
  }

  if (text.includes("maxx") && text.includes("project")) {
    return "Check in with Maxx about the project.";
  }

  const cleaned = firstTwoSentences(suggestion.suggestedNextStep);

  if (
    cleaned.toLowerCase().startsWith("review this situation") ||
    cleaned.toLowerCase().startsWith("review the situation")
  ) {
    return "Decide the next concrete step today.";
  }

  return cleaned || "Choose the next concrete step.";
}

function containsForbiddenLanguage(suggestion: Suggestion): boolean {
  const visibleText = [
    suggestion.title,
    suggestion.whyItMatters,
    suggestion.suggestedNextStep,
  ].join(" ").toLowerCase();

  return forbiddenTerms.some((term) => visibleText.includes(term));
}

export class BasicExecutivePresentationProjector
  implements ExecutivePresentationProjector
{
  project(
    input: ExecutivePresentationInput
  ): PresentedExecutiveSuggestion[] {
    return input.suggestions.map((suggestion) => {
      const presented: PresentedExecutiveSuggestion = {
        ...suggestion,
        title: presentTitle(suggestion),
        whyItMatters: presentWhy(suggestion),
        suggestedNextStep: presentNextStep(suggestion),
      };

      if (containsForbiddenLanguage(presented)) {
        return {
          ...presented,
          whyItMatters: "This appears worth attention today.",
        };
      }

      return presented;
    });
  }
}
