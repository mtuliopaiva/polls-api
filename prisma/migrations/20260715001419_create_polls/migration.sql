-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "Poll" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PollStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdByUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "uuid" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "pollUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Vote" (
    "uuid" TEXT NOT NULL,
    "pollUuid" TEXT NOT NULL,
    "optionUuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "Poll_status_idx" ON "Poll"("status");

-- CreateIndex
CREATE INDEX "Poll_createdByUuid_idx" ON "Poll"("createdByUuid");

-- CreateIndex
CREATE INDEX "Poll_deletedAt_idx" ON "Poll"("deletedAt");

-- CreateIndex
CREATE INDEX "Poll_createdAt_idx" ON "Poll"("createdAt");

-- CreateIndex
CREATE INDEX "PollOption_pollUuid_idx" ON "PollOption"("pollUuid");

-- CreateIndex
CREATE INDEX "Vote_pollUuid_idx" ON "Vote"("pollUuid");

-- CreateIndex
CREATE INDEX "Vote_optionUuid_idx" ON "Vote"("optionUuid");

-- CreateIndex
CREATE INDEX "Vote_userUuid_idx" ON "Vote"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollUuid_userUuid_key" ON "Vote"("pollUuid", "userUuid");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_createdByUuid_fkey" FOREIGN KEY ("createdByUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollUuid_fkey" FOREIGN KEY ("pollUuid") REFERENCES "Poll"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollUuid_fkey" FOREIGN KEY ("pollUuid") REFERENCES "Poll"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_optionUuid_fkey" FOREIGN KEY ("optionUuid") REFERENCES "PollOption"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
