-- AlterTable
ALTER TABLE "QuestionNode" ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD CONSTRAINT "QuestionNode_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
