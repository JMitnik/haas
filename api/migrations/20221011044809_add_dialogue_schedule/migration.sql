-- CreateTable
CREATE TABLE "DialogueSchedule" (
    "id" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "workspaceID" TEXT NOT NULL,
    "dataPeriodScheduleId" TEXT,
    "evaluationPeriodScheduleId" TEXT,

    CONSTRAINT "DialogueSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPeriodSchedule" (
    "id" TEXT NOT NULL,
    "startDateExpression" TEXT NOT NULL,
    "endInDeltaMinutes" INTEGER NOT NULL,
    "dialogueScheduleId" TEXT NOT NULL,

    CONSTRAINT "DataPeriodSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationPeriodSchedule" (
    "id" TEXT NOT NULL,
    "startDateExpression" TEXT NOT NULL,
    "endInDeltaMinutes" INTEGER NOT NULL,
    "dialogueScheduleId" TEXT NOT NULL,

    CONSTRAINT "EvaluationPeriodSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DialogueSchedule_workspaceID_key" ON "DialogueSchedule"("workspaceID");

-- CreateIndex
CREATE UNIQUE INDEX "DataPeriodSchedule_dialogueScheduleId_key" ON "DataPeriodSchedule"("dialogueScheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationPeriodSchedule_dialogueScheduleId_key" ON "EvaluationPeriodSchedule"("dialogueScheduleId");

-- AddForeignKey
ALTER TABLE "DialogueSchedule" ADD CONSTRAINT "DialogueSchedule_workspaceID_fkey" FOREIGN KEY ("workspaceID") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPeriodSchedule" ADD CONSTRAINT "DataPeriodSchedule_dialogueScheduleId_fkey" FOREIGN KEY ("dialogueScheduleId") REFERENCES "DialogueSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationPeriodSchedule" ADD CONSTRAINT "EvaluationPeriodSchedule_dialogueScheduleId_fkey" FOREIGN KEY ("dialogueScheduleId") REFERENCES "DialogueSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
