export type ExecutivePriority = {
  title: string;

  whyItMatters: string;

  suggestedNextStep: string;

  evidence: string[];
};

export type ExecutiveBrief = {
  title: string;

  summary: string;

  priorities: ExecutivePriority[];

  createdAt: Date;
};
