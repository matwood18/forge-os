export type LanguageModelRequest = {
  system: string;
  prompt: string;
};

export type LanguageModelResponse<T> = {
  output: T;
};