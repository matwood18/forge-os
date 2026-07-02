-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectEntityId" TEXT NOT NULL,
    "predicate" TEXT NOT NULL,
    "objectEntityId" TEXT,
    "objectValue" TEXT,
    "confidence" REAL NOT NULL,
    "sourceEventId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Observation_subjectEntityId_fkey" FOREIGN KEY ("subjectEntityId") REFERENCES "Entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Observation_objectEntityId_fkey" FOREIGN KEY ("objectEntityId") REFERENCES "Entity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Observation_subjectEntityId_idx" ON "Observation"("subjectEntityId");

-- CreateIndex
CREATE INDEX "Observation_objectEntityId_idx" ON "Observation"("objectEntityId");

-- CreateIndex
CREATE INDEX "Observation_predicate_idx" ON "Observation"("predicate");
