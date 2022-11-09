-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('ASSIGN_ACTION_REQUEST', 'SEND_STALE_ACTION_REQUEST_REMINDER');

-- AlterEnum
ALTER TYPE "AutomationActionType" ADD VALUE 'SEND_STALE_ACTION_REQUEST_REMINDER';

-- AlterTable
ALTER TABLE "ActionRequest" ADD COLUMN     "lastRemindedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AuditEventOfActionRequest" (
    "actionRequestId" TEXT NOT NULL,
    "auditEventId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "AuditEventType" NOT NULL,
    "version" DOUBLE PRECISION NOT NULL,
    "payload" JSONB NOT NULL,
    "userId" TEXT,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditEventOfActionRequest_actionRequestId_auditEventId_key" ON "AuditEventOfActionRequest"("actionRequestId", "auditEventId");

-- AddForeignKey
ALTER TABLE "AuditEventOfActionRequest" ADD CONSTRAINT "AuditEventOfActionRequest_actionRequestId_fkey" FOREIGN KEY ("actionRequestId") REFERENCES "ActionRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
