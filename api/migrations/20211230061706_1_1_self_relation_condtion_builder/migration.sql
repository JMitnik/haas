/*
  Warnings:

  - A unique constraint covering the columns `[parentConditionBuilderId]` on the table `AutomationConditionBuilder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AutomationConditionBuilder.parentConditionBuilderId_unique" ON "AutomationConditionBuilder"("parentConditionBuilderId");
