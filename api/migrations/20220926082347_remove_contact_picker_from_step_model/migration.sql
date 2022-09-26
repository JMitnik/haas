/*
  Warnings:

  - The values [CONTACT_PICKER] on the enum `FormNodeStepType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FormNodeStepType_new" AS ENUM ('GENERIC_FIELDS');
ALTER TABLE "FormNodeStep" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "FormNodeStep" ALTER COLUMN "type" TYPE "FormNodeStepType_new" USING ("type"::text::"FormNodeStepType_new");
ALTER TYPE "FormNodeStepType" RENAME TO "FormNodeStepType_old";
ALTER TYPE "FormNodeStepType_new" RENAME TO "FormNodeStepType";
DROP TYPE "FormNodeStepType_old";
ALTER TABLE "FormNodeStep" ALTER COLUMN "type" SET DEFAULT 'GENERIC_FIELDS';
COMMIT;
