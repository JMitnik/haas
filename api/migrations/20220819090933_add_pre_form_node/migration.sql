/*
  Warnings:

  - A unique constraint covering the columns `[preFormNodeId]` on the table `FormNode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FormNode" ADD COLUMN     "preFormNodeId" TEXT;

-- CreateTable
CREATE TABLE "PreFormNode" (
    "id" TEXT NOT NULL,
    "header" TEXT,
    "helper" TEXT,
    "nextText" TEXT,
    "finishText" TEXT,
    "formNodeId" TEXT,

    CONSTRAINT "PreFormNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormNode_preFormNodeId_key" ON "FormNode"("preFormNodeId");

-- AddForeignKey
ALTER TABLE "FormNode" ADD CONSTRAINT "FormNode_preFormNodeId_fkey" FOREIGN KEY ("preFormNodeId") REFERENCES "PreFormNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
