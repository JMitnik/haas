/*
  Warnings:

  - The values [CAN_ACCESS_ALL_ACTIONABLES] on the enum `SystemPermissionEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SystemPermissionEnum_new" AS ENUM ('CAN_VIEW_ACTION_REQUESTS', 'CAN_ACCESS_ALL_ACTION_REQUESTS', 'CAN_RESET_WORKSPACE_DATA', 'CAN_ACCESS_ADMIN_PANEL', 'CAN_GENERATE_WORKSPACE_FROM_CSV', 'CAN_ASSIGN_USERS_TO_DIALOGUE', 'CAN_EDIT_DIALOGUE', 'CAN_BUILD_DIALOGUE', 'CAN_VIEW_DIALOGUE', 'CAN_DELETE_DIALOGUE', 'CAN_VIEW_DIALOGUE_ANALYTICS', 'CAN_VIEW_USERS', 'CAN_ADD_USERS', 'CAN_DELETE_USERS', 'CAN_EDIT_USERS', 'CAN_CREATE_TRIGGERS', 'CAN_DELETE_TRIGGERS', 'CAN_DELETE_WORKSPACE', 'CAN_EDIT_WORKSPACE', 'CAN_VIEW_CAMPAIGNS', 'CAN_CREATE_CAMPAIGNS', 'CAN_CREATE_DELIVERIES', 'CAN_CREATE_AUTOMATIONS', 'CAN_UPDATE_AUTOMATIONS', 'CAN_VIEW_AUTOMATIONS', 'CAN_ACCESS_REPORT_PAGE', 'CAN_DOWNLOAD_REPORTS');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "SystemPermissionEnum_new"[] USING ("permissions"::text::"SystemPermissionEnum_new"[]);
ALTER TABLE "User" ALTER COLUMN "globalPermissions" TYPE "SystemPermissionEnum_new"[] USING ("globalPermissions"::text::"SystemPermissionEnum_new"[]);
ALTER TYPE "SystemPermissionEnum" RENAME TO "SystemPermissionEnum_old";
ALTER TYPE "SystemPermissionEnum_new" RENAME TO "SystemPermissionEnum";
DROP TYPE "SystemPermissionEnum_old";
COMMIT;
