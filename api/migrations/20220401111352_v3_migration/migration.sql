-- DropForeignKey
ALTER TABLE "Automation" DROP CONSTRAINT "Automation_automationTriggerId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationCondition" DROP CONSTRAINT "AutomationCondition_automationConditionBuilderId_fkey";

-- DropForeignKey
ALTER TABLE "UserOfCustomer" DROP CONSTRAINT "UserOfCustomer_roleId_fkey";

-- AddForeignKey
ALTER TABLE "UserOfCustomer" ADD CONSTRAINT "UserOfCustomer_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationCondition" ADD CONSTRAINT "AutomationCondition_automationConditionBuilderId_fkey" FOREIGN KEY ("automationConditionBuilderId") REFERENCES "AutomationConditionBuilder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_automationTriggerId_fkey" FOREIGN KEY ("automationTriggerId") REFERENCES "AutomationTrigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
