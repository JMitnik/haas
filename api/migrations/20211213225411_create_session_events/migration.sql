-- CreateEnum
CREATE TYPE "SessionEventType" AS ENUM ('CHOICE_ACTION', 'SLIDER_ACTION', 'NAVIGATION');

-- CreateTable
CREATE TABLE "SessionEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" "SessionEventType" NOT NULL,
    "sliderValueId" TEXT,
    "choiceValueId" TEXT,
    "clientEventAt" TIMESTAMP(3) NOT NULL,
    "toNode" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionEventSliderValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionEventId" TEXT,
    "nodeId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "timeSpentInSec" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionEventChoiceValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionEventId" TEXT,
    "nodeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "timeSpentInSec" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionEvent_sliderValueId_unique" ON "SessionEvent"("sliderValueId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionEvent_choiceValueId_unique" ON "SessionEvent"("choiceValueId");

-- AddForeignKey
ALTER TABLE "SessionEvent" ADD FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEvent" ADD FOREIGN KEY ("sliderValueId") REFERENCES "SessionEventSliderValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEvent" ADD FOREIGN KEY ("choiceValueId") REFERENCES "SessionEventChoiceValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEventSliderValue" ADD FOREIGN KEY ("nodeId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEventChoiceValue" ADD FOREIGN KEY ("nodeId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
