-- DropForeignKey
ALTER TABLE "NodeEntry" DROP CONSTRAINT "NodeEntry_sessionId_fkey";

-- AlterTable
ALTER TABLE "Dialogue" ADD COLUMN     "template" "DialogueTemplateType" DEFAULT E'DEFAULT';

-- AddForeignKey
ALTER TABLE "NodeEntry" ADD CONSTRAINT "NodeEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
