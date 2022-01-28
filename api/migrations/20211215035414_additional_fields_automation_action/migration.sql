-- AlterTable
ALTER TABLE "AutomationAction" ADD COLUMN     "apiKey" TEXT,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "payload" JSONB;
