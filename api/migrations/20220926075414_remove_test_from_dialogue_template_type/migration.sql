/*
  Warnings:

  - The values [TEST] on the enum `DialogueTemplateType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DialogueTemplateType_new" AS ENUM ('STUDENT_NL', 'TEACHER_NL', 'STUDENT_ENG', 'TEACHER_ENG', 'SPORT_ENG', 'SPORT_NL', 'BUSINESS_ENG', 'BUSINESS_NL', 'DEFAULT', 'MASS_SEED');
ALTER TABLE "Dialogue" ALTER COLUMN "template" DROP DEFAULT;
ALTER TABLE "Dialogue" ALTER COLUMN "template" TYPE "DialogueTemplateType_new" USING ("template"::text::"DialogueTemplateType_new");
ALTER TYPE "DialogueTemplateType" RENAME TO "DialogueTemplateType_old";
ALTER TYPE "DialogueTemplateType_new" RENAME TO "DialogueTemplateType";
DROP TYPE "DialogueTemplateType_old";
ALTER TABLE "Dialogue" ALTER COLUMN "template" SET DEFAULT 'DEFAULT';
COMMIT;
