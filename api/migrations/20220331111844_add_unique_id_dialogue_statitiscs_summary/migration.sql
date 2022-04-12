/*
  Warnings:

  - A unique constraint covering the columns `[startDateTime,endDateTime,dialogueId,impactScoreType]` on the table `DialogueStatisticsSummaryCache` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "filterId" ON "DialogueStatisticsSummaryCache"("startDateTime", "endDateTime", "dialogueId", "impactScoreType");
