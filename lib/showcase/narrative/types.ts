export type ShowcaseNarrativeSection = {
  title: string;
  statement: string;
  evidence: string[];
};

export type ShowcaseNarrative = {
  title: string;
  summary: string;
  sections: {
    noticed: ShowcaseNarrativeSection;
    significance: ShowcaseNarrativeSection;
    inference: ShowcaseNarrativeSection;
    recommendation: ShowcaseNarrativeSection;
    authorization: ShowcaseNarrativeSection;
    outcome: ShowcaseNarrativeSection;
  };
};
