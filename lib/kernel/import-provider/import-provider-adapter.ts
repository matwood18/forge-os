// lib/kernel/import-provider/import-provider-adapter.ts
import type {
  ImportDiscoveryPage,
  ImportDiscoveryRequest,
} from "./types";

export type ImportProviderAdapter = {
  discover(request: ImportDiscoveryRequest): Promise<ImportDiscoveryPage>;
};
