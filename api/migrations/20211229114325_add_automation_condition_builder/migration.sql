-- CreateEnum
CREATE TYPE "AutomationConditionBuilderType" AS ENUM ('AND', 'OR');

-- AlterTable
ALTER TABLE "AutomationCondition" ADD COLUMN     "automationConditionBuilderId" TEXT;

-- CreateTable
CREATE TABLE "AutomationConditionBuilder" (
    "id" TEXT NOT NULL,
    "type" "AutomationConditionBuilderType" NOT NULL,
    "automationConditionBuilderId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomationConditionBuilder" ADD FOREIGN KEY ("automationConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD FOREIGN KEY ("automationConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
