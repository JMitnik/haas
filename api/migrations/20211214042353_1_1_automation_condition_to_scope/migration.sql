/*
  Warnings:

  - You are about to drop the column `dialogueScopeId` on the `AutomationCondition` table. All the data in the column will be lost.
  - You are about to drop the column `questionScopeId` on the `AutomationCondition` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceScopeId` on the `AutomationCondition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[automationConditionId]` on the table `DialogueConditionScope` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[automationConditionId]` on the table `QuestionConditionScope` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[automationConditionId]` on the table `WorkspaceConditionScope` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `automationConditionId` to the `DialogueConditionScope` table without a default value. This is not possible if the table is not empty.
  - Added the required column `automationConditionId` to the `QuestionConditionScope` table without a default value. This is not possible if the table is not empty.
  - Added the required column `automationConditionId` to the `WorkspaceConditionScope` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_dialogueScopeId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_questionScopeId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_workspaceScopeId_fkey";

-- AlterTable
ALTER TABLE "AutomationCondition" DROP COLUMN "dialogueScopeId",
DROP COLUMN "questionScopeId",
DROP COLUMN "workspaceScopeId";

-- AlterTable
ALTER TABLE "DialogueConditionScope" ADD COLUMN     "automationConditionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestionConditionScope" ADD COLUMN     "automationConditionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkspaceConditionScope" ADD COLUMN     "automationConditionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DialogueConditionScope.automationConditionId_unique" ON "DialogueConditionScope"("automationConditionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionConditionScope.automationConditionId_unique" ON "QuestionConditionScope"("automationConditionId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceConditionScope.automationConditionId_unique" ON "WorkspaceConditionScope"("automationConditionId");

-- AddForeignKey
ALTER TABLE "QuestionConditionScope" ADD FOREIGN KEY ("automationConditionId") REFERENCES "AutomationCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DialogueConditionScope" ADD FOREIGN KEY ("automationConditionId") REFERENCES "AutomationCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceConditionScope" ADD FOREIGN KEY ("automationConditionId") REFERENCES "AutomationCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
