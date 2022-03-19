-- CreateEnum
CREATE TYPE "QuestionImpactScore" AS ENUM ('PERCENTAGE');

-- CreateTable
CREATE TABLE "QuestionStatisticsSummaryCache" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "nrVotes" INTEGER,
    "impactScore" DOUBLE PRECISION NOT NULL,
    "questionId" TEXT NOT NULL,
    "impactScoreType" "QuestionImpactScore" NOT NULL,

    PRIMARY KEY ("id")
);
