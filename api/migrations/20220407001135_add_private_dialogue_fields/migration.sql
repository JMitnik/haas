-- AlterTable
ALTER TABLE "Dialogue" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_DialogueToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DialogueToUser_AB_unique" ON "_DialogueToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DialogueToUser_B_index" ON "_DialogueToUser"("B");

-- AddForeignKey
ALTER TABLE "_DialogueToUser" ADD FOREIGN KEY ("A") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DialogueToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
