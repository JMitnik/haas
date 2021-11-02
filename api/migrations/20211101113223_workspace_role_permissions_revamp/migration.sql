/*
  Warnings:

  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `Role` table. All the data in the column will be lost.
  - The required column `id` was added to the `Permission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_customerId_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "customerId",
DROP COLUMN "name",
ADD COLUMN     "id" TEXT NOT NULL,
ADD PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "permissions";

-- CreateTable
CREATE TABLE "PermissionsOnRoles" (
    "permissionType" "SystemPermissionEnum" NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT,

    PRIMARY KEY ("permissionType","workspaceId","roleId")
);

-- AddForeignKey
ALTER TABLE "PermissionsOnRoles" ADD FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionsOnRoles" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionsOnRoles" ADD FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
