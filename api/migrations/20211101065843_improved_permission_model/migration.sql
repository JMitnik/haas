/*
  Warnings:

  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `type` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Made the column `customerId` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "id",
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "type" "SystemPermissionEnum" NOT NULL,
ALTER COLUMN "customerId" SET NOT NULL,
ADD PRIMARY KEY ("type", "customerId");
