/*
  Warnings:

  - You are about to drop the column `dialogueConditionScopeId` on the `AutomationConditionMatchValue` table. All the data in the column will be lost.
  - You are about to drop the column `questionConditionScopeId` on the `AutomationConditionMatchValue` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceConditionScopeId` on the `AutomationConditionMatchValue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutomationConditionMatchValue" DROP CONSTRAINT "AutomationConditionMatchValue_dialogueConditionScopeId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationConditionMatchValue" DROP CONSTRAINT "AutomationConditionMatchValue_questionConditionScopeId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationConditionMatchValue" DROP CONSTRAINT "AutomationConditionMatchValue_workspaceConditionScopeId_fkey";

-- AlterTable
ALTER TABLE "AutomationConditionMatchValue" DROP COLUMN "dialogueConditionScopeId",
DROP COLUMN "questionConditionScopeId",
DROP COLUMN "workspaceConditionScopeId";
