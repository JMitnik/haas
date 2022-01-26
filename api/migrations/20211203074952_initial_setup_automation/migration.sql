-- CreateEnum
CREATE TYPE "AutomationType" AS ENUM ('TRIGGER', 'CAMPAIGN');

-- CreateEnum
CREATE TYPE "AutomationEventType" AS ENUM ('RECURRING', 'NEW_INTERACTION_QUESTION', 'NEW_INTERACTION_DIALOGUE', 'API_CALL');

-- CreateEnum
CREATE TYPE "RecurringPeriodType" AS ENUM ('EVERY_WEEK', 'EVERY_DAY', 'START_OF_DAY', 'END_OF_DAY', 'START_OF_WEEK', 'END_OF_WEEK');

-- CreateEnum
CREATE TYPE "AutomationConditionScopeType" AS ENUM ('QUESTION', 'DIALOGUE', 'WORKSPACE');

-- CreateEnum
CREATE TYPE "AutomationConditionOperatorType" AS ENUM ('SMALLER_THAN', 'SMALLER_OR_EQUAL_THAN', 'GREATER_THAN', 'GREATER_OR_EQUAL_THAN', 'INNER_RANGE', 'OUTER_RANGE', 'IS_EQUAL', 'IS_NOT_EQUAL', 'IS_TRUE', 'IS_FALSE', 'EVERY_N_TH_TIME');

-- CreateEnum
CREATE TYPE "MatchValueType" AS ENUM ('STRING', 'INT', 'DATE_TIME');

-- CreateEnum
CREATE TYPE "QuestionAspect" AS ENUM ('NODE_VALUE', 'ANSWER_SPEED');

-- CreateEnum
CREATE TYPE "DialogueAspect" AS ENUM ('NR_INTERACTIONS', 'NR_VISITORS', 'GENERAL_SCORE', 'LATEST_SCORE');

-- CreateEnum
CREATE TYPE "WorkspaceAspect" AS ENUM ('NR_INTERACTIONS', 'NR_VISITORS', 'GENERAL_SCORE');

-- CreateEnum
CREATE TYPE "ConditionPropertyAggregateType" AS ENUM ('COUNT', 'MIN', 'MAX', 'AVG');

-- CreateEnum
CREATE TYPE "AutomationActionType" AS ENUM ('SEND_SMS', 'SEND_EMAIL', 'API_CALL', 'GENERATE_REPORT', 'WEBHOOK');

-- CreateTable
CREATE TABLE "AutomationEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "AutomationEventType" NOT NULL,
    "questionId" TEXT,
    "dialogueId" TEXT,
    "periodType" "RecurringPeriodType",
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationConditionMatchValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "MatchValueType" NOT NULL,
    "numberValue" INTEGER,
    "textValue" TEXT,
    "dateTimeValue" TIMESTAMP(3),
    "questionConditionScopeId" TEXT,
    "dialogueConditionScopeId" TEXT,
    "workspaceConditionScopeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionPropertyAggregate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "latest" INTEGER,
    "type" "ConditionPropertyAggregateType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionConditionScope" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "aspect" "QuestionAspect" NOT NULL,
    "aggregateId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DialogueConditionScope" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "aspect" "DialogueAspect" NOT NULL,
    "aggregateId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceConditionScope" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "aspect" "WorkspaceAspect" NOT NULL,
    "aggregateId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationCondition" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "scope" "AutomationConditionScopeType" NOT NULL,
    "operator" "AutomationConditionOperatorType" NOT NULL,
    "matchValueId" TEXT NOT NULL,
    "questionScopeId" TEXT,
    "dialogueScopeId" TEXT,
    "workspaceScopeId" TEXT,
    "questionId" TEXT,
    "dialogueId" TEXT,
    "automationTriggerId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationAction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "AutomationActionType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationTrigger" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Automation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "AutomationType" NOT NULL,
    "automationTriggerId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AutomationActionToAutomationTrigger" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AutomationActionToAutomationTrigger_AB_unique" ON "_AutomationActionToAutomationTrigger"("A", "B");

-- CreateIndex
CREATE INDEX "_AutomationActionToAutomationTrigger_B_index" ON "_AutomationActionToAutomationTrigger"("B");

-- AddForeignKey
ALTER TABLE "AutomationEvent" ADD FOREIGN KEY ("questionId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationEvent" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationConditionMatchValue" ADD FOREIGN KEY ("questionConditionScopeId") REFERENCES "QuestionConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationConditionMatchValue" ADD FOREIGN KEY ("dialogueConditionScopeId") REFERENCES "DialogueConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationConditionMatchValue" ADD FOREIGN KEY ("workspaceConditionScopeId") REFERENCES "WorkspaceConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionConditionScope" ADD FOREIGN KEY ("aggregateId") REFERENCES "ConditionPropertyAggregate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DialogueConditionScope" ADD FOREIGN KEY ("aggregateId") REFERENCES "ConditionPropertyAggregate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceConditionScope" ADD FOREIGN KEY ("aggregateId") REFERENCES "ConditionPropertyAggregate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("matchValueId") REFERENCES "AutomationConditionMatchValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("questionScopeId") REFERENCES "QuestionConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("dialogueScopeId") REFERENCES "DialogueConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("workspaceScopeId") REFERENCES "WorkspaceConditionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("questionId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("automationTriggerId") REFERENCES "AutomationTrigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationTrigger" ADD FOREIGN KEY ("eventId") REFERENCES "AutomationEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD FOREIGN KEY ("automationTriggerId") REFERENCES "AutomationTrigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutomationActionToAutomationTrigger" ADD FOREIGN KEY ("A") REFERENCES "AutomationAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AutomationActionToAutomationTrigger" ADD FOREIGN KEY ("B") REFERENCES "AutomationTrigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;
