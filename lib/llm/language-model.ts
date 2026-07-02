import type { LanguageModelRequest, LanguageModelResponse } from "./types";

export interface LanguageModel {
  complete<T>(
    request: LanguageModelRequest
  ): Promise<LanguageModelResponse<T>>;
}