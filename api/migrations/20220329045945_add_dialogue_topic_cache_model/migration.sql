-- CreateTable
CREATE TABLE "DialogueTopicCache" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "dialogueId" TEXT,
    "name" TEXT NOT NULL,
    "nrVotes" INTEGER NOT NULL,
    "impactScore" DOUBLE PRECISION NOT NULL,
    "impactScoreType" "DialogueImpactScore" NOT NULL,
    "parentTopicId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DialogueTopicCache" ADD FOREIGN KEY ("parentTopicId") REFERENCES "DialogueTopicCache"("id") ON DELETE SET NULL ON UPDATE CASCADE;
