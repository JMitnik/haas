-- CreateTable
CREATE TABLE "PathedSessionsCache" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "path" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PathedSessionsCacheToSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PathedSessionsCacheToSession_AB_unique" ON "_PathedSessionsCacheToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_PathedSessionsCacheToSession_B_index" ON "_PathedSessionsCacheToSession"("B");

-- AddForeignKey
ALTER TABLE "_PathedSessionsCacheToSession" ADD FOREIGN KEY ("A") REFERENCES "PathedSessionsCache"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PathedSessionsCacheToSession" ADD FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
