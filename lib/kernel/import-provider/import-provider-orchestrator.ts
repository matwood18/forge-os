// lib/kernel/import-provider/import-provider-orchestrator.ts
import type { SourceDocument } from "@/lib/kernel/source-document";
import type { ImportProviderAdapter } from "./import-provider-adapter";
import type { SourceDocumentMapper } from "./source-document-mapper";
import type {
  ImportCursor,
  ImportProviderBatchPlan,
} from "./types";

export type ImportProviderPageProcessor = (
  documents: SourceDocument[]
) => Promise<void>;

export type ImportProviderOrchestratorInput = {
  sourceSystem: string;
  initialCursor: ImportCursor | null;
  batchPlan: ImportProviderBatchPlan;
  processPage: ImportProviderPageProcessor;
};

export type ImportProviderOrchestratorResult = {
  pagesDiscovered: number;
  recordsDiscovered: number;
  documentsMapped: number;
  finalCursor: ImportCursor | null;
};

export interface ImportProviderOrchestrator {
  run(
    input: ImportProviderOrchestratorInput
  ): Promise<ImportProviderOrchestratorResult>;
}

export class BasicImportProviderOrchestrator
  implements ImportProviderOrchestrator
{
  constructor(
    private readonly adapter: ImportProviderAdapter,
    private readonly mapper: SourceDocumentMapper
  ) {}

  async run(
    input: ImportProviderOrchestratorInput
  ): Promise<ImportProviderOrchestratorResult> {
    this.assertPositiveLimit(
      input.batchPlan.discoveryLimit,
      "Discovery limit"
    );
    this.assertPositiveLimit(
      input.batchPlan.processingLimit,
      "Processing limit"
    );

    let cursor = input.initialCursor;
    let pagesDiscovered = 0;
    let recordsDiscovered = 0;
    let documentsMapped = 0;

    do {
      const page = await this.adapter.discover({
        sourceSystem: input.sourceSystem,
        cursor,
        limit: input.batchPlan.discoveryLimit,
      });

      pagesDiscovered += 1;
      recordsDiscovered += page.records.length;

      const documents = page.records.map((record) =>
        this.mapper.map({ record })
      );

      documentsMapped += documents.length;

      for (
        let offset = 0;
        offset < documents.length;
        offset += input.batchPlan.processingLimit
      ) {
        await input.processPage(
          documents.slice(offset, offset + input.batchPlan.processingLimit)
        );
      }

      this.assertCursorContract(cursor, page.nextCursor, page.hasMore);

      cursor = page.nextCursor;
    } while (cursor);

    return {
      pagesDiscovered,
      recordsDiscovered,
      documentsMapped,
      finalCursor: cursor,
    };
  }

  private assertPositiveLimit(value: number, name: string): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`${name} must be a positive integer.`);
    }
  }

  private assertCursorContract(
    currentCursor: ImportCursor | null,
    nextCursor: ImportCursor | null,
    hasMore: boolean
  ): void {
    if (hasMore && nextCursor === null) {
      throw new Error(
        "Provider returned hasMore=true without a next cursor."
      );
    }

    if (!hasMore && nextCursor !== null) {
      throw new Error(
        "Provider returned hasMore=false with a next cursor."
      );
    }

    if (
      currentCursor !== null &&
      nextCursor !== null &&
      currentCursor.value === nextCursor.value
    ) {
      throw new Error("Provider cursor did not advance.");
    }
  }
}
