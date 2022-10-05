-- CreateEnum
CREATE TYPE "ActionableState" AS ENUM ('UNVERIFIED', 'PENDING', 'STALE', 'COMPLETED', 'DROPPED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jobDescription" TEXT;

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" TEXT NOT NULL,
    "actionableId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actionable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dialogueId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "issueId" TEXT,
    "status" "ActionableState" NOT NULL DEFAULT E'UNVERIFIED',

    CONSTRAINT "Actionable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issue_topicId_key" ON "Issue"("topicId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_actionableId_fkey" FOREIGN KEY ("actionableId") REFERENCES "Actionable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actionable" ADD CONSTRAINT "Actionable_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actionable" ADD CONSTRAINT "Actionable_dialogueId_fkey" FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actionable" ADD CONSTRAINT "Actionable_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[actionableId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "actionableId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_actionableId_key" ON "Session"("actionableId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_actionableId_fkey" FOREIGN KEY ("actionableId") REFERENCES "Actionable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Actionable" ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - You are about to drop the column `isUrgent` on the `Actionable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actionable" DROP COLUMN "isUrgent",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

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

-- AlterTable
ALTER TABLE "Actionable" ADD COLUMN     "requestEmail" TEXT;

-- AlterEnum
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_ACCESS_ALL_ACTIONABLES';

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

/*
  Warnings:

  - You are about to drop the column `actionableId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `actionableId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Actionable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[actionRequestId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionRequestId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionRequestState" AS ENUM ('PENDING', 'STALE', 'COMPLETED', 'DROPPED');

-- DropForeignKey
ALTER TABLE "Actionable" DROP CONSTRAINT "Actionable_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Actionable" DROP CONSTRAINT "Actionable_dialogueId_fkey";

-- DropForeignKey
ALTER TABLE "Actionable" DROP CONSTRAINT "Actionable_issueId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_actionableId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_actionableId_fkey";

-- DropIndex
DROP INDEX "Session_actionableId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "actionableId",
ADD COLUMN     "actionRequestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "actionableId",
ADD COLUMN     "actionRequestId" TEXT;

-- DropTable
DROP TABLE "Actionable";

-- DropEnum
DROP TYPE "ActionableState";

-- CreateTable
CREATE TABLE "ActionRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dialogueId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "issueId" TEXT,
    "requestEmail" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "ActionRequestState" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ActionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_actionRequestId_key" ON "Session"("actionRequestId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_actionRequestId_fkey" FOREIGN KEY ("actionRequestId") REFERENCES "ActionRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_dialogueId_fkey" FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionRequest" ADD CONSTRAINT "ActionRequest_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_actionRequestId_fkey" FOREIGN KEY ("actionRequestId") REFERENCES "ActionRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
