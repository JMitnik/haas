-- DropForeignKey
ALTER TABLE "FormNodeStep" DROP CONSTRAINT "FormNodeStep_formNodeId_fkey";

-- AlterTable
ALTER TABLE "FormNodeStep" ALTER COLUMN "formNodeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FormNodeStep" ADD CONSTRAINT "FormNodeStep_formNodeId_fkey" FOREIGN KEY ("formNodeId") REFERENCES "FormNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
