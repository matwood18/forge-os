import type { DemoSession } from "../session";
import type {
  DecisionChainItem,
  DecisionChainProjection,
} from "./types";

type DecisionChainSource = Pick<
  DemoSession,
  | "id"
  | "reflectionInspector"
  | "recommendationInspector"
  | "authorizationDecisionInspector"
  | "actionInspector"
>;

export class DecisionChainBuilder {
  build(session: DecisionChainSource): DecisionChainProjection {
    const reflectionsById = new Map(
      session.reflectionInspector.items.map((reflection) => [
        reflection.id,
        reflection,
      ])
    );

    const recommendationsById = new Map(
      session.recommendationInspector.items.map((recommendation) => [
        recommendation.id,
        recommendation,
      ])
    );

    const authorizationDecisionsById = new Map(
      session.authorizationDecisionInspector.items.map((decision) => [
        decision.id,
        decision,
      ])
    );

    const items = session.actionInspector.items.flatMap((action) => {
      const authorizationDecision = authorizationDecisionsById.get(
        action.authorizationDecisionId
      );

      const recommendation = recommendationsById.get(
        action.recommendationId
      );

      if (!authorizationDecision || !recommendation) {
        return [];
      }

      if (
        action.executionId !== session.id ||
        authorizationDecision.executionId !== session.id ||
        recommendation.executionId !== session.id
      ) {
        return [];
      }

      if (
        authorizationDecision.recommendationId !== recommendation.id ||
        action.recommendationId !== recommendation.id
      ) {
        return [];
      }

      const reflections = recommendation.sourceReflectionIds.map(
        (reflectionId) => reflectionsById.get(reflectionId)
      );

      if (
        reflections.length === 0 ||
        reflections.some(
          (reflection) =>
            !reflection || reflection.executionId !== session.id
        )
      ) {
        return [];
      }

      const completeReflections = reflections.filter(
        (reflection) => reflection !== undefined
      );

      const item: DecisionChainItem = {
        id: action.id,
        executionId: session.id,
        reflections: completeReflections,
        recommendation,
        authorizationDecision,
        action,
        headline: this.buildHeadline(action.title),
        explanation: this.buildExplanation({
          reflectionTitles: completeReflections.map(
            (reflection) => reflection.title
          ),
          recommendationTitle: recommendation.title,
          authorizationRationale: authorizationDecision.rationale,
          actionTitle: action.title,
        }),
      };

      return [item];
    });

    return {
      id: session.id,
      items,
    };
  }

  private buildHeadline(actionTitle: string): string {
    return `Why Forge created "${actionTitle}"`;
  }

  private buildExplanation(input: {
    reflectionTitles: string[];
    recommendationTitle: string;
    authorizationRationale: string;
    actionTitle: string;
  }): string {
    const reflectionSummary = input.reflectionTitles.join("; ");

    return [
      `Forge noticed: ${reflectionSummary}.`,
      `Therefore Forge recommended: ${input.recommendationTitle}.`,
      `Policy evaluation: ${input.authorizationRationale}`,
      `Forge materialized: ${input.actionTitle}.`,
    ].join(" ");
  }
}