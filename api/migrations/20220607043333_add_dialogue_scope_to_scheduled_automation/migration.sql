-- AlterTable
ALTER TABLE "AutomationScheduled" ADD COLUMN     "dialogueId" TEXT;

-- AddForeignKey
ALTER TABLE "AutomationScheduled" ADD CONSTRAINT "AutomationScheduled_dialogueId_fkey" FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
