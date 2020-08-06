# Migration `20200727171234-removed`

This migration has been generated at 7/27/2020, 5:12:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."ColourSettings" (
"dark" text   ,
"darkest" text   ,
"error" text   ,
"id" SERIAL,
"light" text   ,
"lightest" text   ,
"muted" text   ,
"normal" text   ,
"primary" text  NOT NULL ,
"primaryAlt" text   ,
"secondary" text   ,
"success" text   ,
"tertiary" text   ,
"text" text   ,
"warning" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."FontSettings" (
"body" text   ,
"fontTitle" text   ,
"id" SERIAL,
"settingTitle" text   ,
"special" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."CustomerSettings" (
"id" SERIAL,
"logoUrl" text   ,
"colourSettingsId" integer   ,
"fontSettingsId" integer   ,
"customerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Customer" (
"id" text  NOT NULL ,
"slug" text  NOT NULL ,
"name" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Tag" (
"id" text  NOT NULL ,
"type" "TagEnum" NOT NULL ,
"name" text  NOT NULL ,
"customerId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Dialogue" (
"id" text  NOT NULL ,
"title" text  NOT NULL ,
"slug" text  NOT NULL ,
"description" text  NOT NULL ,
"creationDate" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   ,
"publicTitle" text   ,
"customerId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."QuestionNode" (
"id" text  NOT NULL ,
"creationDate" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL ,
"isLeaf" boolean  NOT NULL DEFAULT false,
"isRoot" boolean  NOT NULL DEFAULT false,
"title" text  NOT NULL ,
"type" "NodeType" NOT NULL DEFAULT E'GENERIC',
"overrideLeafId" text   ,
"questionDialogueId" text   ,
"edgeId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Link" (
"id" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   ,
"title" text   ,
"type" "LinkTypeEnum" NOT NULL ,
"url" text  NOT NULL ,
"iconUrl" text   ,
"backgroundColor" text   ,
"questionNodeId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Edge" (
"childNodeId" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)  NOT NULL ,
"id" text  NOT NULL ,
"parentNodeId" text  NOT NULL ,
"dialogueId" text   ,
"questionNodeId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."QuestionCondition" (
"conditionType" text  NOT NULL ,
"id" SERIAL,
"matchValue" text   ,
"renderMax" integer   ,
"renderMin" integer   ,
"edgeId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."QuestionOption" (
"id" SERIAL,
"publicValue" text   ,
"value" text  NOT NULL ,
"questionId" text   ,
"questionNodeId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Session" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"id" text  NOT NULL ,
"dialogueId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."NodeEntry" (
"id" text  NOT NULL ,
"creationDate" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"depth" integer   ,
"relatedEdgeId" text   ,
"relatedNodeId" text   ,
"sessionId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."LinkNodeEntry" (
"id" SERIAL,
"value" jsonb   ,
"nodeEntryId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."SliderNodeEntry" (
"id" SERIAL,
"value" integer   ,
"nodeEntryId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."ChoiceNodeEntry" (
"id" SERIAL,
"value" text   ,
"nodeEntryId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."TextboxNodeEntry" (
"id" SERIAL,
"value" text   ,
"nodeEntryId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."RegistrationNodeEntry" (
"id" SERIAL,
"value" jsonb   ,
"nodeEntryId" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Permission" (
"id" text  NOT NULL ,
"name" text  NOT NULL ,
"description" text   ,
"customerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Role" (
"id" text  NOT NULL ,
"name" text  NOT NULL ,
"roleId" text   ,
"customerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"id" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   ,
"email" text  NOT NULL ,
"password" text  NOT NULL ,
"phone" text   ,
"firstName" text   ,
"lastName" text   ,
"triggerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."UserOfCustomer" (
"userId" text  NOT NULL ,
"customerId" text  NOT NULL ,
"roleId" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("userId","customerId"))

CREATE TABLE "public"."TriggerCondition" (
"id" SERIAL,
"type" "TriggerConditionEnum" NOT NULL ,
"minValue" integer   ,
"maxValue" integer   ,
"textValue" text   ,
"triggerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."Trigger" (
"id" text  NOT NULL ,
"lastSent" timestamp(3)   ,
"name" text  NOT NULL ,
"type" "TriggerEnum" NOT NULL ,
"medium" "TriggerMedium" NOT NULL ,
"relatedNodeId" text   ,
"customerId" text   ,
"userOfCustomerUserId" text   ,
"userOfCustomerCustomerId" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."_DialogueToTag" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE TABLE "public"."_PermissionToRole" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE UNIQUE INDEX "CustomerSettings.customerId" ON "public"."CustomerSettings"("customerId")

CREATE UNIQUE INDEX "CustomerSettings_colourSettingsId" ON "public"."CustomerSettings"("colourSettingsId")

CREATE UNIQUE INDEX "CustomerSettings_fontSettingsId" ON "public"."CustomerSettings"("fontSettingsId")

CREATE UNIQUE INDEX "Customer.slug" ON "public"."Customer"("slug")

CREATE UNIQUE INDEX "LinkNodeEntry_nodeEntryId" ON "public"."LinkNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "SliderNodeEntry_nodeEntryId" ON "public"."SliderNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "ChoiceNodeEntry_nodeEntryId" ON "public"."ChoiceNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "TextboxNodeEntry_nodeEntryId" ON "public"."TextboxNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "RegistrationNodeEntry_nodeEntryId" ON "public"."RegistrationNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "Role.id_name" ON "public"."Role"("id","name")

CREATE UNIQUE INDEX "_DialogueToTag_AB_unique" ON "public"."_DialogueToTag"("A","B")

CREATE  INDEX "_DialogueToTag_B_index" ON "public"."_DialogueToTag"("B")

CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "public"."_PermissionToRole"("A","B")

CREATE  INDEX "_PermissionToRole_B_index" ON "public"."_PermissionToRole"("B")

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("colourSettingsId")REFERENCES "public"."ColourSettings"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("fontSettingsId")REFERENCES "public"."FontSettings"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Dialogue" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("overrideLeafId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("questionDialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("edgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Link" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("childNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("parentNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("dialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionCondition" ADD FOREIGN KEY ("edgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionOption" ADD FOREIGN KEY ("questionId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."QuestionOption" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Session" ADD FOREIGN KEY ("dialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("sessionId")REFERENCES "public"."Session"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("relatedNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("relatedEdgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."LinkNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."SliderNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ChoiceNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."TextboxNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."RegistrationNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Permission" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Role" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."User" ADD FOREIGN KEY ("triggerId")REFERENCES "public"."Trigger"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("roleId")REFERENCES "public"."Role"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."TriggerCondition" ADD FOREIGN KEY ("triggerId")REFERENCES "public"."Trigger"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Trigger" ADD FOREIGN KEY ("relatedNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Trigger" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."Trigger" ADD FOREIGN KEY ("userOfCustomerUserId", "userOfCustomerCustomerId")REFERENCES "public"."UserOfCustomer"("userId","customerId") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."_DialogueToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Dialogue"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_DialogueToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_PermissionToRole" ADD FOREIGN KEY ("A")REFERENCES "public"."Permission"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_PermissionToRole" ADD FOREIGN KEY ("B")REFERENCES "public"."Role"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727170845-test..20200727171234-removed
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 // binaryTargets = ["debian-openssl-1.1.x"]
 generator client {
@@ -300,9 +300,9 @@
   triggers Trigger[]
   createdAt DateTime @default(now())
-  @@id([userId, customerId, roleId])
+  @@id([userId, customerId])
 }
 enum TriggerEnum {
   QUESTION
```


