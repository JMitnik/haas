/*
  Warnings:

  - You are about to drop the `PermissionsOnRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PermissionsOnRoles" DROP CONSTRAINT "PermissionsOnRoles_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionsOnRoles" DROP CONSTRAINT "PermissionsOnRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionsOnRoles" DROP CONSTRAINT "PermissionsOnRoles_workspaceId_fkey";

-- DropTable
DROP TABLE "PermissionsOnRoles";

-- CreateTable
CREATE TABLE "PermissionOfWorkspaceRole" (
    "workspaceId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    PRIMARY KEY ("permissionId","workspaceId","roleId")
);

-- AddForeignKey
ALTER TABLE "PermissionOfWorkspaceRole" ADD FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionOfWorkspaceRole" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionOfWorkspaceRole" ADD FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
