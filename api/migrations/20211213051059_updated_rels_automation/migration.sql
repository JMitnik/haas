/*
  Warnings:

  - You are about to drop the column `matchValueId` on the `AutomationCondition` table. All the data in the column will be lost.
  - You are about to drop the column `aggregateId` on the `DialogueConditionScope` table. All the data in the column will be lost.
  - You are about to drop the column `aggregateId` on the `QuestionConditionScope` table. All the data in the column will be lost.
  - You are about to drop the column `aggregateId` on the `WorkspaceConditionScope` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionConditionScopeId]` on the table `ConditionPropertyAggregate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dialogueConditionScopeId]` on the table `ConditionPropertyAggregate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceConditionScopeId]` on the table `ConditionPropertyAggregate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `automationConditionId` to the `AutomationConditionMatchValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_matchValueId_fkey";

-- DropForeignKey
ALTER TABLE "DialogueConditionScope" DROP CONSTRAINT "DialogueConditionScope_aggregateId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionConditionScope" DROP CONSTRAINT "QuestionConditionScope_aggregateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceConditionScope" DROP CONSTRAINT "WorkspaceConditionScope_aggregateId_fkey";

-- AlterTable
ALTER TABLE "Automation" ALTER COLUMN "automationTriggerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AutomationCondition" DROP COLUMN "matchValueId";

-- AlterTable
ALTER TABLE "AutomationConditionMatchValue" ADD COLUMN     "automationConditionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConditionPropertyAggregate" ADD COLUMN     "dialogueConditionScopeId" TEXT,
ADD COLUMN     "questionConditionScopeId" TEXT,
ADD COLUMN     "workspaceConditionScopeId" TEXT;

-- AlterTable
ALTER TABLE "DialogueConditionScope" DROP COLUMN "aggregateId";

-- AlterTable
ALTER TABLE "QuestionConditionScope" DROP COLUMN "aggregateId";

-- AlterTable
ALTER TABLE "WorkspaceConditionScope" DROP COLUMN "aggregateId";

-- CreateIndex
CREATE UNIQUE INDEX "ConditionPropertyAggregate.questionConditionScopeId_unique" ON "ConditionPropertyAggregate"("questionConditionScopeId");

-- CreateIndex
CREATE UNIQUE INDEX "ConditionPropertyAggregate.dialogueConditionScopeId_unique" ON "ConditionPropertyAggregate"("dialogueConditionScopeId");

-- CreateIndex
CREATE UNIQUE INDEX "ConditionPropertyAggregate.workspaceConditionScopeId_unique" ON "ConditionPropertyAggregate"("workspaceConditionScopeId");

-- AddForeignKey
ALTER TABLE "AutomationConditionMatchValue" ADD FOREIGN KEY ("automationConditionId") REFERENCES "AutomationCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionPropertyAggregate" ADD FOREIGN KEY ("questionConditionScopeId") REFERENCES "QuestionConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionPropertyAggregate" ADD FOREIGN KEY ("dialogueConditionScopeId") REFERENCES "DialogueConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionPropertyAggregate" ADD FOREIGN KEY ("workspaceConditionScopeId") REFERENCES "WorkspaceConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;
