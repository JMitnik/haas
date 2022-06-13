/*
  Warnings:

  - The `targets` column on the `FormNodeField` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FormNodeField" DROP COLUMN "targets",
ADD COLUMN     "targets" JSONB;
