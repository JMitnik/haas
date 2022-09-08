/*
  Warnings:

  - You are about to drop the column `formNodePageId` on the `FormNodeField` table. All the data in the column will be lost.
  - You are about to drop the `FormNodePage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FormNodeStepType" AS ENUM ('CONTACT_PICKER', 'GENERIC_FIELDS');

-- DropForeignKey
ALTER TABLE "FormNodeField" DROP CONSTRAINT "FormNodeField_formNodePageId_fkey";

-- DropForeignKey
ALTER TABLE "FormNodePage" DROP CONSTRAINT "FormNodePage_formNodeId_fkey";

-- AlterTable
ALTER TABLE "FormNodeField" DROP COLUMN "formNodePageId",
ADD COLUMN     "formNodeStepId" TEXT;

-- DropTable
DROP TABLE "FormNodePage";

-- DropEnum
DROP TYPE "FormNodePageType";

-- CreateTable
CREATE TABLE "FormNodeStep" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "FormNodeStepType" NOT NULL DEFAULT E'GENERIC_FIELDS',
    "header" TEXT NOT NULL,
    "helper" TEXT NOT NULL,
    "subHelper" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "formNodeId" TEXT NOT NULL,

    CONSTRAINT "FormNodeStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormNodeStep" ADD CONSTRAINT "FormNodeStep_formNodeId_fkey" FOREIGN KEY ("formNodeId") REFERENCES "FormNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeField" ADD CONSTRAINT "FormNodeField_formNodeStepId_fkey" FOREIGN KEY ("formNodeStepId") REFERENCES "FormNodeStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
