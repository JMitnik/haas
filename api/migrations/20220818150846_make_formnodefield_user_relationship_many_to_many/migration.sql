/*
  Warnings:

  - You are about to drop the column `formNodeFieldId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_formNodeFieldId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "formNodeFieldId";

-- CreateTable
CREATE TABLE "_FormNodeFieldToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormNodeFieldToUser_AB_unique" ON "_FormNodeFieldToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FormNodeFieldToUser_B_index" ON "_FormNodeFieldToUser"("B");

-- AddForeignKey
ALTER TABLE "_FormNodeFieldToUser" ADD CONSTRAINT "_FormNodeFieldToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FormNodeField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormNodeFieldToUser" ADD CONSTRAINT "_FormNodeFieldToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
