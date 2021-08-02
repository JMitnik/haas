-- CreateEnum
CREATE TYPE "TagEnum" AS ENUM ('DEFAULT', 'AGENT', 'LOCATION');

-- CreateEnum
CREATE TYPE "LanguageEnum" AS ENUM ('DUTCH', 'GERMAN', 'ENGLISH');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('GENERIC', 'SLIDER', 'FORM', 'CHOICE', 'REGISTRATION', 'TEXTBOX', 'LINK', 'SHARE', 'VIDEO_EMBEDDED');

-- CreateEnum
CREATE TYPE "FormNodeFieldType" AS ENUM ('email', 'phoneNumber', 'url', 'shortText', 'longText', 'number');

-- CreateEnum
CREATE TYPE "LinkTypeEnum" AS ENUM ('SOCIAL', 'API', 'FACEBOOK', 'LINKEDIN', 'WHATSAPP', 'INSTAGRAM', 'TWITTER');

-- CreateEnum
CREATE TYPE "InputSource" AS ENUM ('CLIENT', 'INIT_GENERATED');

-- CreateEnum
CREATE TYPE "SystemPermissionEnum" AS ENUM ('CAN_ACCESS_ADMIN_PANEL', 'CAN_EDIT_DIALOGUE', 'CAN_BUILD_DIALOGUE', 'CAN_VIEW_DIALOGUE', 'CAN_DELETE_DIALOGUE', 'CAN_VIEW_DIALOGUE_ANALYTICS', 'CAN_VIEW_USERS', 'CAN_ADD_USERS', 'CAN_DELETE_USERS', 'CAN_EDIT_USERS', 'CAN_CREATE_TRIGGERS', 'CAN_DELETE_TRIGGERS', 'CAN_DELETE_WORKSPACE', 'CAN_EDIT_WORKSPACE', 'CAN_VIEW_CAMPAIGNS', 'CAN_CREATE_CAMPAIGNS', 'CAN_CREATE_DELIVERIES');

-- CreateEnum
CREATE TYPE "RoleTypeEnum" AS ENUM ('ADMIN', 'MANAGER', 'USER', 'GUEST', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TriggerEnum" AS ENUM ('QUESTION', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "TriggerMedium" AS ENUM ('EMAIL', 'PHONE', 'BOTH');

-- CreateEnum
CREATE TYPE "TriggerConditionEnum" AS ENUM ('LOW_THRESHOLD', 'HIGH_THRESHOLD', 'INNER_RANGE', 'OUTER_RANGE', 'TEXT_MATCH');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('CREATE_WORKSPACE_JOB');

-- CreateEnum
CREATE TYPE "CloudReferenceType" AS ENUM ('AWS', 'GCP', 'Azure', 'IBM');

-- CreateEnum
CREATE TYPE "JobStatusType" AS ENUM ('PRE_PROCESSING', 'PRE_PROCESSING_LOGO', 'PRE_PROCESSING_WEBSITE_SCREENSHOT', 'READY_FOR_PROCESSING', 'IN_PHOTOSHOP_QUEUE', 'PHOTOSHOP_PROCESSING', 'PROCESSING', 'WRAPPING_UP', 'PENDING', 'COMPLETED', 'FAILED', 'TRANSFORMING_PSDS_TO_PNGS', 'STITCHING_SLIDES', 'COMPRESSING_SALES_MATERIAL');

-- CreateEnum
CREATE TYPE "JobProcessLocationType" AS ENUM ('ONE_PAGER', 'PITCHDECK', 'BROCHURE');

-- CreateEnum
CREATE TYPE "CampaignVariantTypeEnum" AS ENUM ('EMAIL', 'SMS', 'QUEUE');

-- CreateEnum
CREATE TYPE "DeliveryStatusTypeEnum" AS ENUM ('SCHEDULED', 'DEPLOYED', 'SENT', 'OPENED', 'FINISHED');

-- CreateTable
CREATE TABLE "ColourSettings" (
    "dark" TEXT,
    "darkest" TEXT,
    "error" TEXT,
    "id" SERIAL NOT NULL,
    "light" TEXT,
    "lightest" TEXT,
    "muted" TEXT,
    "normal" TEXT,
    "primary" TEXT NOT NULL,
    "primaryAlt" TEXT,
    "secondary" TEXT,
    "success" TEXT,
    "tertiary" TEXT,
    "text" TEXT,
    "warning" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontSettings" (
    "body" TEXT,
    "fontTitle" TEXT,
    "id" SERIAL NOT NULL,
    "settingTitle" TEXT,
    "special" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSettings" (
    "id" SERIAL NOT NULL,
    "logoUrl" TEXT,
    "colourSettingsId" INTEGER,
    "fontSettingsId" INTEGER,
    "customerId" TEXT,
    "logoOpacity" INTEGER DEFAULT 30,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "type" "TagEnum" NOT NULL DEFAULT E'DEFAULT',
    "name" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLeafNode" (
    "id" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "subtext" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dialogue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "publicTitle" TEXT,
    "customerId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isWithoutGenData" BOOLEAN NOT NULL DEFAULT false,
    "endScreenText" TEXT,
    "wasGeneratedWithGenData" BOOLEAN NOT NULL DEFAULT false,
    "postLeafNodeId" TEXT,
    "language" "LanguageEnum" NOT NULL DEFAULT E'ENGLISH',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormNodeField" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FormNodeFieldType" NOT NULL DEFAULT E'shortText',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "formNodeId" TEXT,
    "placeholder" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormNode" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "helperText" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormNodeFieldEntryData" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "url" TEXT,
    "shortText" TEXT,
    "longText" TEXT,
    "number" INTEGER,
    "relatedFieldId" TEXT NOT NULL,
    "formNodeEntryId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormNodeEntry" (
    "id" SERIAL NOT NULL,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderNodeRange" (
    "id" TEXT NOT NULL,
    "start" DECIMAL(65,30),
    "end" DECIMAL(65,30),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderNodeMarker" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "subLabel" TEXT NOT NULL,
    "sliderNodeId" TEXT NOT NULL,
    "sliderNodeRangeId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderNode" (
    "id" TEXT NOT NULL,
    "earlyReleaseText" TEXT,
    "unhappyText" TEXT,
    "happyText" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoEmbeddedNode" (
    "id" TEXT NOT NULL,
    "videoUrl" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionNode" (
    "id" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isLeaf" BOOLEAN NOT NULL DEFAULT false,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "type" "NodeType" NOT NULL DEFAULT E'GENERIC',
    "overrideLeafId" TEXT,
    "questionDialogueId" TEXT,
    "edgeId" TEXT,
    "videoEmbeddedNodeId" TEXT,
    "sliderNodeId" TEXT,
    "formNodeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tooltip" TEXT,
    "questionNodeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" TEXT,
    "type" "LinkTypeEnum" NOT NULL,
    "url" TEXT NOT NULL,
    "iconUrl" TEXT,
    "backgroundColor" TEXT,
    "questionNodeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "childNodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "parentNodeId" TEXT NOT NULL,
    "dialogueId" TEXT,
    "questionNodeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCondition" (
    "conditionType" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "matchValue" TEXT,
    "renderMax" INTEGER,
    "renderMin" INTEGER,
    "edgeId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" SERIAL NOT NULL,
    "publicValue" TEXT,
    "value" TEXT NOT NULL,
    "overrideLeafId" TEXT,
    "questionId" TEXT,
    "questionNodeId" TEXT,
    "position" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "dialogueId" TEXT NOT NULL,
    "deliveryId" TEXT,
    "originUrl" TEXT,
    "totalTimeInSec" INTEGER,
    "device" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodeEntry" (
    "id" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "depth" INTEGER,
    "relatedEdgeId" TEXT,
    "relatedNodeId" TEXT,
    "sessionId" TEXT,
    "inputSource" "InputSource" NOT NULL DEFAULT E'CLIENT',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" TEXT,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" JSONB,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SliderNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" INTEGER,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChoiceNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" TEXT,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextboxNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" TEXT,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationNodeEntry" (
    "id" SERIAL NOT NULL,
    "value" JSONB,
    "nodeEntryId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "customerId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoleTypeEnum" NOT NULL DEFAULT E'USER',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "permissions" "SystemPermissionEnum"[],
    "customerId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "globalPermissions" "SystemPermissionEnum"[],
    "loginToken" TEXT,
    "loginTokenExpiry" TIMESTAMP(3),
    "refreshToken" TEXT,
    "refreshTokenExpiry" TIMESTAMP(3),
    "lastActivity" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOfCustomer" (
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId","customerId")
);

-- CreateTable
CREATE TABLE "TriggerCondition" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "type" "TriggerConditionEnum" NOT NULL DEFAULT E'LOW_THRESHOLD',
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "textValue" TEXT,
    "triggerId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "lastSent" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "type" "TriggerEnum" NOT NULL DEFAULT E'QUESTION',
    "medium" "TriggerMedium" NOT NULL,
    "relatedNodeId" TEXT,
    "customerId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOfTrigger" (
    "questionId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "triggerConditionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("questionId","triggerId")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "type" "JobType" NOT NULL,
    "createWorkspaceJobId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobProcessLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "xMaterialDimension" INTEGER NOT NULL DEFAULT 0,
    "yMaterialDimension" INTEGER NOT NULL DEFAULT 0,
    "type" "JobProcessLocationType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "jobProcessLocationId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateWorkspaceJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT,
    "referenceId" TEXT,
    "message" TEXT,
    "errorMessage" TEXT,
    "referenceType" "CloudReferenceType" NOT NULL,
    "status" "JobStatusType" NOT NULL DEFAULT E'PENDING',
    "resourcesUrl" TEXT,
    "requiresRembg" BOOLEAN NOT NULL DEFAULT true,
    "requiresScreenshot" BOOLEAN NOT NULL DEFAULT true,
    "requiresColorExtraction" BOOLEAN NOT NULL DEFAULT true,
    "jobProcessLocationId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignVariantToCampaign" (
    "campaignId" TEXT NOT NULL,
    "campaignVariantId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,

    PRIMARY KEY ("campaignId","campaignVariantId")
);

-- CreateTable
CREATE TABLE "CampaignVariant" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "subject" TEXT,
    "type" "CampaignVariantTypeEnum" NOT NULL,
    "customerId" TEXT NOT NULL,
    "dialogueId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "deliveryRecipientFirstName" TEXT,
    "deliveryRecipientLastName" TEXT,
    "deliveryRecipientEmail" TEXT,
    "deliveryRecipientPhone" TEXT,
    "campaignId" TEXT NOT NULL,
    "campaignVariantId" TEXT NOT NULL,
    "currentStatus" "DeliveryStatusTypeEnum" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryEvents" (
    "id" TEXT NOT NULL,
    "status" "DeliveryStatusTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DialogueToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TriggerToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSettings.colourSettingsId_unique" ON "CustomerSettings"("colourSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSettings.fontSettingsId_unique" ON "CustomerSettings"("fontSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSettings.customerId_unique" ON "CustomerSettings"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer.slug_unique" ON "Customer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dialogue.postLeafNodeId_unique" ON "Dialogue"("postLeafNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Dialogue.slug_customerId_unique" ON "Dialogue"("slug", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "FormNodeEntry.nodeEntryId_unique" ON "FormNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "Share.questionNodeId_unique" ON "Share"("questionNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoNodeEntry.nodeEntryId_unique" ON "VideoNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkNodeEntry.nodeEntryId_unique" ON "LinkNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "SliderNodeEntry.nodeEntryId_unique" ON "SliderNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "ChoiceNodeEntry.nodeEntryId_unique" ON "ChoiceNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "TextboxNodeEntry.nodeEntryId_unique" ON "TextboxNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationNodeEntry.nodeEntryId_unique" ON "RegistrationNodeEntry"("nodeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "Role.id_name_unique" ON "Role"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job.createWorkspaceJobId_unique" ON "Job"("createWorkspaceJobId");

-- CreateIndex
CREATE UNIQUE INDEX "_DialogueToTag_AB_unique" ON "_DialogueToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DialogueToTag_B_index" ON "_DialogueToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TriggerToUser_AB_unique" ON "_TriggerToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TriggerToUser_B_index" ON "_TriggerToUser"("B");

-- AddForeignKey
ALTER TABLE "CustomerSettings" ADD FOREIGN KEY ("colourSettingsId") REFERENCES "ColourSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSettings" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSettings" ADD FOREIGN KEY ("fontSettingsId") REFERENCES "FontSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dialogue" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dialogue" ADD FOREIGN KEY ("postLeafNodeId") REFERENCES "PostLeafNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeField" ADD FOREIGN KEY ("formNodeId") REFERENCES "FormNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeFieldEntryData" ADD FOREIGN KEY ("formNodeEntryId") REFERENCES "FormNodeEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeFieldEntryData" ADD FOREIGN KEY ("relatedFieldId") REFERENCES "FormNodeField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SliderNodeMarker" ADD FOREIGN KEY ("sliderNodeId") REFERENCES "SliderNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SliderNodeMarker" ADD FOREIGN KEY ("sliderNodeRangeId") REFERENCES "SliderNodeRange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("edgeId") REFERENCES "Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("formNodeId") REFERENCES "FormNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("overrideLeafId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("questionDialogueId") REFERENCES "Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("sliderNodeId") REFERENCES "SliderNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionNode" ADD FOREIGN KEY ("videoEmbeddedNodeId") REFERENCES "VideoEmbeddedNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD FOREIGN KEY ("questionNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("questionNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD FOREIGN KEY ("childNodeId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD FOREIGN KEY ("parentNodeId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD FOREIGN KEY ("questionNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCondition" ADD FOREIGN KEY ("edgeId") REFERENCES "Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD FOREIGN KEY ("overrideLeafId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD FOREIGN KEY ("questionId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD FOREIGN KEY ("questionNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEntry" ADD FOREIGN KEY ("relatedEdgeId") REFERENCES "Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEntry" ADD FOREIGN KEY ("relatedNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodeEntry" ADD FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SliderNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChoiceNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextboxNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationNodeEntry" ADD FOREIGN KEY ("nodeEntryId") REFERENCES "NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOfCustomer" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOfCustomer" ADD FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOfCustomer" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriggerCondition" ADD FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD FOREIGN KEY ("relatedNodeId") REFERENCES "QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOfTrigger" ADD FOREIGN KEY ("questionId") REFERENCES "QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOfTrigger" ADD FOREIGN KEY ("triggerConditionId") REFERENCES "TriggerCondition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOfTrigger" ADD FOREIGN KEY ("triggerId") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD FOREIGN KEY ("createWorkspaceJobId") REFERENCES "CreateWorkspaceJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD FOREIGN KEY ("jobProcessLocationId") REFERENCES "JobProcessLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreateWorkspaceJob" ADD FOREIGN KEY ("jobProcessLocationId") REFERENCES "JobProcessLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD FOREIGN KEY ("workspaceId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignVariantToCampaign" ADD FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignVariantToCampaign" ADD FOREIGN KEY ("campaignVariantId") REFERENCES "CampaignVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignVariant" ADD FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignVariant" ADD FOREIGN KEY ("dialogueId") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD FOREIGN KEY ("campaignVariantId") REFERENCES "CampaignVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryEvents" ADD FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DialogueToTag" ADD FOREIGN KEY ("A") REFERENCES "Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DialogueToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggerToUser" ADD FOREIGN KEY ("A") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggerToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
