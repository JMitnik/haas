/*
  Warnings:

  - The values [communicationUser] on the enum `FormNodeFieldType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FormNodeFieldType_new" AS ENUM ('email', 'phoneNumber', 'url', 'shortText', 'longText', 'number', 'contacts');
ALTER TABLE "FormNodeField" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "FormNodeField" ALTER COLUMN "type" TYPE "FormNodeFieldType_new" USING ("type"::text::"FormNodeFieldType_new");
ALTER TYPE "FormNodeFieldType" RENAME TO "FormNodeFieldType_old";
ALTER TYPE "FormNodeFieldType_new" RENAME TO "FormNodeFieldType";
DROP TYPE "FormNodeFieldType_old";
ALTER TABLE "FormNodeField" ALTER COLUMN "type" SET DEFAULT 'shortText';
COMMIT;
