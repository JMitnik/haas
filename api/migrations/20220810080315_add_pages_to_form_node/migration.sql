-- CreateEnum
CREATE TYPE "FormNodePageType" AS ENUM ('CONTACT_PICKER', 'INPUT_DATA', 'SUBMIT_OVERVIEW');

-- AlterTable
ALTER TABLE "FormNodeField" ADD COLUMN     "formNodePageId" TEXT;

-- CreateTable
CREATE TABLE "FormNodePage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "FormNodePageType" NOT NULL DEFAULT E'INPUT_DATA',
    "header" TEXT NOT NULL,
    "helper" TEXT NOT NULL,
    "subHelper" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "formNodeId" TEXT NOT NULL,

    CONSTRAINT "FormNodePage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormNodePage" ADD CONSTRAINT "FormNodePage_formNodeId_fkey" FOREIGN KEY ("formNodeId") REFERENCES "FormNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeField" ADD CONSTRAINT "FormNodeField_formNodePageId_fkey" FOREIGN KEY ("formNodePageId") REFERENCES "FormNodePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
