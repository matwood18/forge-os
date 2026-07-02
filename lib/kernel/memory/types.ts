export type LearnEntityInput = {
  type: "PERSON" | "ORGANIZATION" | "PLACE" | "PRODUCT" | "PROJECT" | "UNKNOWN";
  displayName: string;
};

export type LearnEntityResult = {
  id: string;
  type: LearnEntityInput["type"];
  displayName: string;
};