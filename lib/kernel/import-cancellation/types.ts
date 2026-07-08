export type ImportCancellationIdentity = {
  sourceSystem: string;
  externalImportId: string;
};

export type ImportCancellation = {
  id: string;
  identity: ImportCancellationIdentity;
  requestedAt: Date;
  cancelledAt: Date | null;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ImportCancellationRequest = {
  id: string;
  identity: ImportCancellationIdentity;
  requestedAt?: Date;
  reason?: string;
};
