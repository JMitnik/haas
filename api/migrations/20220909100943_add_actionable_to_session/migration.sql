/*
  Warnings:

  - A unique constraint covering the columns `[actionableId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "actionableId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_actionableId_key" ON "Session"("actionableId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_actionableId_fkey" FOREIGN KEY ("actionableId") REFERENCES "Actionable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
