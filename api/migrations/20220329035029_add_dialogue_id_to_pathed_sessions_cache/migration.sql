/*
  Warnings:

  - Added the required column `dialogueId` to the `PathedSessionsCache` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PathedSessionsCache" ADD COLUMN     "dialogueId" TEXT NOT NULL;
