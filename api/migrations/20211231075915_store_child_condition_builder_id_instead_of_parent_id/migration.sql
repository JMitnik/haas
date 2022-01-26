/*
  Warnings:

  - You are about to drop the column `parentConditionBuilderId` on the `AutomationConditionBuilder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[childConditionBuilderId]` on the table `AutomationConditionBuilder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AutomationConditionBuilder" DROP CONSTRAINT "AutomationConditionBuilder_parentConditionBuilderId_fkey";

-- DropIndex
DROP INDEX "AutomationConditionBuilder.parentConditionBuilderId_unique";

-- AlterTable
ALTER TABLE "AutomationConditionBuilder" DROP COLUMN "parentConditionBuilderId",
ADD COLUMN     "childConditionBuilderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AutomationConditionBuilder.childConditionBuilderId_unique" ON "AutomationConditionBuilder"("childConditionBuilderId");

-- AddForeignKey
ALTER TABLE "AutomationConditionBuilder" ADD FOREIGN KEY ("childConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
