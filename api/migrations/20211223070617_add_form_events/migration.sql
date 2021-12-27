/*
  Warnings:

  - A unique constraint covering the columns `[formValueId]` on the table `SessionEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SessionEvent" ADD COLUMN     "formValueId" TEXT;

-- CreateTable
CREATE TABLE "SessionEventFormValues" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionEventId" TEXT,
    "nodeId" TEXT NOT NULL,
    "timeSpentInSec" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionEventFormValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionFormEventId" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "url" TEXT,
    "shortText" TEXT,
    "longText" TEXT,
    "number" INTEGER,
    "relatedFieldId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionEvent_formValueId_unique" ON "SessionEvent"("formValueId");

-- AddForeignKey
ALTER TABLE "SessionEvent" ADD FOREIGN KEY ("formValueId") REFERENCES "SessionEventFormValues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEventFormValues" ADD FOREIGN KEY ("nodeId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEventFormValue" ADD FOREIGN KEY ("sessionFormEventId") REFERENCES "SessionEventFormValues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEventFormValue" ADD FOREIGN KEY ("relatedFieldId") REFERENCES "FormNodeField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
