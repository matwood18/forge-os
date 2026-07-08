export type ImportLeaseIdentity = {
  sourceSystem: string;
  externalImportId: string;
};

export type ImportLease = {
  id: string;
  identity: ImportLeaseIdentity;
  ownerId: string;
  acquiredAt: Date;
  expiresAt: Date;
  releasedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ImportLeaseAcquireInput = {
  id: string;
  identity: ImportLeaseIdentity;
  ownerId: string;
  acquiredAt?: Date;
  expiresAt: Date;
};

export type ImportLeaseReleaseInput = {
  identity: ImportLeaseIdentity;
  ownerId: string;
  releasedAt?: Date;
};

export type ImportLeaseAcquireResult =
  | {
      acquired: true;
      lease: ImportLease;
    }
  | {
      acquired: false;
      activeLease: ImportLease;
    };
