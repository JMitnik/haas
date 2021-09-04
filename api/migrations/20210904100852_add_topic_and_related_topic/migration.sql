-- AlterTable
ALTER TABLE "QuestionNode" ADD COLUMN     "relatedTopicId" TEXT;

-- AlterTable
ALTER TABLE "QuestionOption" ADD COLUMN     "relatedTopicValueId" TEXT;

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "relatedDialogueId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicValue" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "parentTopicId" TEXT NOT NULL,
    "position" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("relatedTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD FOREIGN KEY ("relatedTopicValueId") REFERENCES "TopicValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD FOREIGN KEY ("relatedDialogueId") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicValue" ADD FOREIGN KEY ("parentTopicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
