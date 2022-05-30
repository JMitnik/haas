-- CreateEnum
CREATE TYPE "DialogueImpactScore" AS ENUM ('AVERAGE');

-- CreateTable
CREATE TABLE "DialogueStatisticsSummaryCache" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "impactScore" DOUBLE PRECISION NOT NULL,
    "dialogueId" TEXT NOT NULL,
    "impactScoreType" "DialogueImpactScore" NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DialogueStatisticsSummaryCache" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
