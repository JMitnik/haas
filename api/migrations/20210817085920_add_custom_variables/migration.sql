-- CreateTable
CREATE TABLE "CampaignVariantCustomVariable" (
    "id" TEXT NOT NULL,
    "campaignVariantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CampaignVariantCustomVariable" ADD FOREIGN KEY ("campaignVariantId") REFERENCES "CampaignVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
