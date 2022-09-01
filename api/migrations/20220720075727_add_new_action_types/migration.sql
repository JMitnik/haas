/*
  Warnings:

  - The values [GENERATE_REPORT] on the enum `AutomationActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AutomationActionType_new" AS ENUM ('SEND_SMS', 'SEND_EMAIL', 'API_CALL', 'SEND_DIALOGUE_LINK', 'WEEK_REPORT', 'MONTH_REPORT', 'YEAR_REPORT', 'WEBHOOK');
ALTER TABLE "AutomationAction" ALTER COLUMN "type" TYPE "AutomationActionType_new" USING ("type"::text::"AutomationActionType_new");
ALTER TYPE "AutomationActionType" RENAME TO "AutomationActionType_old";
ALTER TYPE "AutomationActionType_new" RENAME TO "AutomationActionType";
DROP TYPE "AutomationActionType_old";
COMMIT;
