-- CreateEnum
CREATE TYPE "TourType" AS ENUM ('RELEASE', 'GUIDE');

-- CreateTable
CREATE TABLE "TourStep" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titleKey" TEXT NOT NULL,
    "helperKey" TEXT NOT NULL,
    "imageUrlKey" TEXT,
    "userTourId" TEXT NOT NULL,

    CONSTRAINT "TourStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourOfUser" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seenAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "userTourId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserTour" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TourType" NOT NULL,
    "triggerPage" TEXT,
    "triggerVersion" TEXT,

    CONSTRAINT "UserTour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourOfUser_userId_userTourId_key" ON "TourOfUser"("userId", "userTourId");

-- AddForeignKey
ALTER TABLE "TourStep" ADD CONSTRAINT "TourStep_userTourId_fkey" FOREIGN KEY ("userTourId") REFERENCES "UserTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourOfUser" ADD CONSTRAINT "TourOfUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourOfUser" ADD CONSTRAINT "TourOfUser_userTourId_fkey" FOREIGN KEY ("userTourId") REFERENCES "UserTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
