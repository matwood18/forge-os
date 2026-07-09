-- CreateTable
CREATE TABLE "ImportSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceSystem" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "discovered" INTEGER NOT NULL,
    "processed" INTEGER NOT NULL,
    "succeeded" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ImportCheckpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceSystem" TEXT NOT NULL,
    "externalImportId" TEXT NOT NULL,
    "cursorPayload" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ImportLease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceSystem" TEXT NOT NULL,
    "externalImportId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "acquiredAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "releasedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ImportCancellation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceSystem" TEXT NOT NULL,
    "externalImportId" TEXT NOT NULL,
    "requestedAt" DATETIME NOT NULL,
    "cancelledAt" DATETIME,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExecutiveConcern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "firstObserved" DATETIME NOT NULL,
    "lastObserved" DATETIME NOT NULL,
    "supportingEvidencePayload" TEXT NOT NULL,
    "latestRecommendationPayload" TEXT,
    "clarificationNeededPayload" TEXT,
    "resolutionPayload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ImportSession_sourceSystem_idx" ON "ImportSession"("sourceSystem");

-- CreateIndex
CREATE INDEX "ImportSession_externalId_idx" ON "ImportSession"("externalId");

-- CreateIndex
CREATE INDEX "ImportSession_status_idx" ON "ImportSession"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ImportSession_sourceSystem_externalId_key" ON "ImportSession"("sourceSystem", "externalId");

-- CreateIndex
CREATE INDEX "ImportCheckpoint_sourceSystem_idx" ON "ImportCheckpoint"("sourceSystem");

-- CreateIndex
CREATE INDEX "ImportCheckpoint_externalImportId_idx" ON "ImportCheckpoint"("externalImportId");

-- CreateIndex
CREATE INDEX "ImportCheckpoint_completed_idx" ON "ImportCheckpoint"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "ImportCheckpoint_sourceSystem_externalImportId_key" ON "ImportCheckpoint"("sourceSystem", "externalImportId");

-- CreateIndex
CREATE INDEX "ImportLease_sourceSystem_idx" ON "ImportLease"("sourceSystem");

-- CreateIndex
CREATE INDEX "ImportLease_externalImportId_idx" ON "ImportLease"("externalImportId");

-- CreateIndex
CREATE INDEX "ImportLease_ownerId_idx" ON "ImportLease"("ownerId");

-- CreateIndex
CREATE INDEX "ImportLease_expiresAt_idx" ON "ImportLease"("expiresAt");

-- CreateIndex
CREATE INDEX "ImportLease_releasedAt_idx" ON "ImportLease"("releasedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ImportLease_sourceSystem_externalImportId_key" ON "ImportLease"("sourceSystem", "externalImportId");

-- CreateIndex
CREATE INDEX "ImportCancellation_sourceSystem_idx" ON "ImportCancellation"("sourceSystem");

-- CreateIndex
CREATE INDEX "ImportCancellation_externalImportId_idx" ON "ImportCancellation"("externalImportId");

-- CreateIndex
CREATE UNIQUE INDEX "ImportCancellation_sourceSystem_externalImportId_key" ON "ImportCancellation"("sourceSystem", "externalImportId");

-- CreateIndex
CREATE INDEX "ExecutiveConcern_status_idx" ON "ExecutiveConcern"("status");

-- CreateIndex
CREATE INDEX "ExecutiveConcern_importance_idx" ON "ExecutiveConcern"("importance");

-- CreateIndex
CREATE INDEX "ExecutiveConcern_lastObserved_idx" ON "ExecutiveConcern"("lastObserved");
