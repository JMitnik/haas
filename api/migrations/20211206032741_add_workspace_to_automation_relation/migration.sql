/*
  Warnings:

  - Added the required column `workspaceId` to the `Automation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Automation" ADD FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
