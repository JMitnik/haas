/*
  Warnings:

  - You are about to drop the column `clientEventAt` on the `SessionEvent` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `SessionEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SessionEvent" DROP COLUMN "clientEventAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;
