-- CreateTable
CREATE TABLE "Audit" (
    "uuid" TEXT NOT NULL,
    "actorUuid" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityUuid" TEXT,
    "oldData" JSONB,
    "newData" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Log" (
    "uuid" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "stack" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "Audit_actorUuid_idx" ON "Audit"("actorUuid");

-- CreateIndex
CREATE INDEX "Audit_entity_idx" ON "Audit"("entity");

-- CreateIndex
CREATE INDEX "Audit_entityUuid_idx" ON "Audit"("entityUuid");

-- CreateIndex
CREATE INDEX "Audit_createdAt_idx" ON "Audit"("createdAt");

-- CreateIndex
CREATE INDEX "Log_level_idx" ON "Log"("level");

-- CreateIndex
CREATE INDEX "Log_createdAt_idx" ON "Log"("createdAt");
