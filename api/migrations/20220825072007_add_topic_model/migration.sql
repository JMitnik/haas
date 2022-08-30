-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('SYSTEM', 'WORKSPACE');

-- AlterTable
ALTER TABLE "QuestionOption" ADD COLUMN     "topicId" TEXT;

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TopicType" NOT NULL DEFAULT E'SYSTEM',
    "parentTopicId" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_topics_to_sub_topics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_topics_to_sub_topics_AB_unique" ON "_topics_to_sub_topics"("A", "B");

-- CreateIndex
CREATE INDEX "_topics_to_sub_topics_B_index" ON "_topics_to_sub_topics"("B");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_topics_to_sub_topics" ADD CONSTRAINT "_topics_to_sub_topics_A_fkey" FOREIGN KEY ("A") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_topics_to_sub_topics" ADD CONSTRAINT "_topics_to_sub_topics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
/*
  Warnings:

  - You are about to drop the column `parentTopicId` on the `Topic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "parentTopicId";

-- AlterTable
ALTER TABLE "QuestionNode" ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD CONSTRAINT "QuestionNode_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
