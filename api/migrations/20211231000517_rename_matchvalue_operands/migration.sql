/*
  Warnings:

  - You are about to drop the `AutomationConditionMatchValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OperandType" AS ENUM ('STRING', 'INT', 'DATE_TIME');

-- DropForeignKey
ALTER TABLE "AutomationConditionMatchValue" DROP CONSTRAINT "AutomationConditionMatchValue_automationConditionId_fkey";

-- DropTable
DROP TABLE "AutomationConditionMatchValue";

-- DropEnum
DROP TYPE "MatchValueType";

-- CreateTable
CREATE TABLE "AutomationConditionOperand" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "OperandType" NOT NULL,
    "numberValue" INTEGER,
    "textValue" TEXT,
    "dateTimeValue" TIMESTAMP(3),
    "automationConditionId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomationConditionOperand" ADD FOREIGN KEY ("automationConditionId") REFERENCES "AutomationCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
