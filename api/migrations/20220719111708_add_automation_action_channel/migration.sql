/*
  Warnings:

  - You are about to drop the column `payload` on the `AutomationAction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AutomationActionChannelType" AS ENUM ('EMAIL', 'SMS', 'SLACK');

-- AlterTable
ALTER TABLE "AutomationAction" DROP COLUMN "payload";

-- CreateTable
CREATE TABLE "AutomationActionChannel" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "payload" JSONB,
    "automationActionId" TEXT,
    "type" "AutomationActionChannelType" NOT NULL DEFAULT E'EMAIL',

    CONSTRAINT "AutomationActionChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomationActionChannel" ADD CONSTRAINT "AutomationActionChannel_automationActionId_fkey" FOREIGN KEY ("automationActionId") REFERENCES "AutomationAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
