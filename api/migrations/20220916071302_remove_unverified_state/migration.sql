/*
  Warnings:

  - The values [UNVERIFIED] on the enum `ActionableState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionableState_new" AS ENUM ('PENDING', 'STALE', 'COMPLETED', 'DROPPED');
ALTER TABLE "Actionable" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Actionable" ALTER COLUMN "status" TYPE "ActionableState_new" USING ("status"::text::"ActionableState_new");
ALTER TYPE "ActionableState" RENAME TO "ActionableState_old";
ALTER TYPE "ActionableState_new" RENAME TO "ActionableState";
DROP TYPE "ActionableState_old";
ALTER TABLE "Actionable" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Actionable" ALTER COLUMN "status" SET DEFAULT E'PENDING';
