/*
  Warnings:

  - You are about to drop the column `automationTriggerId` on the `AutomationCondition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[automationConditionBuilderId]` on the table `AutomationTrigger` will be added. If there are existing duplicate values, this will fail.
  - Made the column `automationConditionBuilderId` on table `AutomationCondition` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `automationConditionBuilderId` to the `AutomationTrigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_automationTriggerId_fkey";

-- AlterTable
ALTER TABLE "AutomationCondition" DROP COLUMN "automationTriggerId",
ALTER COLUMN "automationConditionBuilderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "AutomationTrigger" ADD COLUMN     "automationConditionBuilderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AutomationTrigger.automationConditionBuilderId_unique" ON "AutomationTrigger"("automationConditionBuilderId");

-- AddForeignKey
ALTER TABLE "AutomationTrigger" ADD FOREIGN KEY ("automationConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
