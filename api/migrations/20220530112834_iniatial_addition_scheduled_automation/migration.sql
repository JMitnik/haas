-- AlterEnum
ALTER TYPE "AutomationType" ADD VALUE 'SCHEDULED';

-- AlterEnum
ALTER TYPE "RecurringPeriodType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "automationScheduledId" TEXT;

-- AlterTable
ALTER TABLE "AutomationAction" ADD COLUMN     "automationScheduledId" TEXT;

-- CreateTable
CREATE TABLE "AutomationScheduled" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "minutes" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "dayOfMonth" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "AutomationScheduled_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomationAction" ADD CONSTRAINT "AutomationAction_automationScheduledId_fkey" FOREIGN KEY ("automationScheduledId") REFERENCES "AutomationScheduled"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_automationScheduledId_fkey" FOREIGN KEY ("automationScheduledId") REFERENCES "AutomationScheduled"("id") ON DELETE SET NULL ON UPDATE CASCADE;
