/*
  Warnings:

  - You are about to drop the column `automationConditionBuilderId` on the `AutomationConditionBuilder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutomationConditionBuilder" DROP CONSTRAINT "AutomationConditionBuilder_automationConditionBuilderId_fkey";

-- AlterTable
ALTER TABLE "AutomationConditionBuilder" DROP COLUMN "automationConditionBuilderId",
ADD COLUMN     "parentConditionBuilderId" TEXT;

-- AddForeignKey
ALTER TABLE "AutomationConditionBuilder" ADD FOREIGN KEY ("parentConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
