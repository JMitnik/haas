/*
  Warnings:

  - You are about to drop the column `isUrgent` on the `Actionable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actionable" DROP COLUMN "isUrgent",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
