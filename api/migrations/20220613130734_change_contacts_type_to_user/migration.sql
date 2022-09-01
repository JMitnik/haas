/*
  Warnings:

  - You are about to drop the column `targets` on the `FormNodeField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormNodeField" DROP COLUMN "targets";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "formNodeFieldId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_formNodeFieldId_fkey" FOREIGN KEY ("formNodeFieldId") REFERENCES "FormNodeField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
