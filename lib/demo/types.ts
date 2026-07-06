export type DemoStageId =
  | "input"
  | "events"
  | "semantic-events"
  | "observations"
  | "relationships"
  | "memories"
  | "beliefs"
  | "worldview"
  | "arguments"
  | "questions";

export type DemoArtifactMetadataValue =
  | string
  | number
  | boolean
  | null
  | DemoArtifactMetadataValue[]
  | {
      [key: string]: DemoArtifactMetadataValue;
    };

export type DemoArtifact = {
  id: string;

  title: string;

  summary: string;

  details?: string[];

  metadata?: Record<string, DemoArtifactMetadataValue>;
};

export type DemoStage = {
  id: DemoStageId;

  title: string;

  description?: string;

  artifacts: DemoArtifact[];
};

export type DemoPipeline = {
  stages: DemoStage[];
};