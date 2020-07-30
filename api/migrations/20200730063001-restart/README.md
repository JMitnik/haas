# Migration `20200730063001-restart`

This migration has been generated at 7/30/2020, 6:30:01 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."NodeEntryValue" DROP CONSTRAINT "NodeEntryValue_nodeEntryId_fkey"

ALTER TABLE "public"."NodeEntryValue" DROP CONSTRAINT "NodeEntryValue_parentNodeEntryValueId_fkey"

CREATE TABLE "public"."Link" (
"backgroundColor" text   ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"iconUrl" text   ,
"id" text  NOT NULL ,
"questionNodeId" text   ,
"title" text   ,
"type" "LinkTypeEnum" NOT NULL ,
"updatedAt" timestamp(3)   ,
"url" text  NOT NULL ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."LinkNodeEntry" (
"id" SERIAL,
"nodeEntryId" text  NOT NULL ,
"value" jsonb   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."SliderNodeEntry" (
"id" SERIAL,
"nodeEntryId" text  NOT NULL ,
"value" integer   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."ChoiceNodeEntry" (
"id" SERIAL,
"nodeEntryId" text  NOT NULL ,
"value" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."TextboxNodeEntry" (
"id" SERIAL,
"nodeEntryId" text  NOT NULL ,
"value" text   ,
    PRIMARY KEY ("id"))

CREATE TABLE "public"."RegistrationNodeEntry" (
"id" SERIAL,
"nodeEntryId" text  NOT NULL ,
"value" jsonb   ,
    PRIMARY KEY ("id"))

ALTER TABLE "public"."QuestionNode" DROP COLUMN "type",
ADD COLUMN "type" "NodeType" NOT NULL DEFAULT E'GENERIC';

ALTER TABLE "public"."Tag" ALTER COLUMN "customerId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN "type" "TagEnum" NOT NULL DEFAULT E'DEFAULT';

ALTER TABLE "public"."Trigger" DROP COLUMN "type",
ADD COLUMN "type" "TriggerEnum" NOT NULL DEFAULT E'QUESTION';

ALTER TABLE "public"."TriggerCondition" ALTER COLUMN "triggerId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN "type" "TriggerConditionEnum" NOT NULL DEFAULT E'LOW_THRESHOLD';

CREATE UNIQUE INDEX "LinkNodeEntry_nodeEntryId" ON "public"."LinkNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "SliderNodeEntry_nodeEntryId" ON "public"."SliderNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "ChoiceNodeEntry_nodeEntryId" ON "public"."ChoiceNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "TextboxNodeEntry_nodeEntryId" ON "public"."TextboxNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "RegistrationNodeEntry_nodeEntryId" ON "public"."RegistrationNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "Customer.slug" ON "public"."Customer"("slug")

CREATE UNIQUE INDEX "CustomerSettings.customerId" ON "public"."CustomerSettings"("customerId")

CREATE UNIQUE INDEX "CustomerSettings_colourSettingsId" ON "public"."CustomerSettings"("colourSettingsId")

CREATE UNIQUE INDEX "CustomerSettings_fontSettingsId" ON "public"."CustomerSettings"("fontSettingsId")

CREATE UNIQUE INDEX "_DialogueToTag_AB_unique" ON "public"."_DialogueToTag"("A","B")

CREATE  INDEX "_DialogueToTag_B_index" ON "public"."_DialogueToTag"("B")

CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "public"."_PermissionToRole"("A","B")

CREATE  INDEX "_PermissionToRole_B_index" ON "public"."_PermissionToRole"("B")

CREATE UNIQUE INDEX "Role.id_name" ON "public"."Role"("id","name")

CREATE UNIQUE INDEX "_TriggerToUser_AB_unique" ON "public"."_TriggerToUser"("A","B")

CREATE  INDEX "_TriggerToUser_B_index" ON "public"."_TriggerToUser"("B")

CREATE UNIQUE INDEX "User.customerId_email" ON "public"."User"("customerId","email")

ALTER TABLE "public"."Link" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."LinkNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."SliderNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ChoiceNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."TextboxNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."RegistrationNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE  ON UPDATE CASCADE

DROP TABLE "public"."NodeEntryValue";

DROP TYPE "TagType"

DROP TYPE "TriggerConditionType"

DROP TYPE "TriggerType"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200730063001-restart
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,337 @@
+datasource postgresql {
+  provider = "postgresql"
+  url = "***"
+}
+
+// binaryTargets = ["debian-openssl-1.1.x"]
+generator client {
+  provider = "prisma-client-js"
+  output   = "./node_modules/@prisma/client"
+}
+
+model ColourSettings {
+  dark             String?
+  darkest          String?
+  error            String?
+  id               Int               @default(autoincrement()) @id
+  light            String?
+  lightest         String?
+  muted            String?
+  normal           String?
+  primary          String
+  primaryAlt       String?
+  secondary        String?
+  success          String?
+  tertiary         String?
+  text             String?
+  warning          String?
+  customerSettings CustomerSettings?
+}
+
+model FontSettings {
+  body             String?
+  fontTitle        String?
+  id               Int               @default(autoincrement()) @id
+  settingTitle     String?
+  special          String?
+  customerSettings CustomerSettings?
+}
+
+model CustomerSettings {
+  id               Int             @default(autoincrement()) @id
+  logoUrl          String?
+  colourSettingsId Int?
+  colourSettings   ColourSettings? @relation(fields: [colourSettingsId], references: [id])
+  fontSettingsId   Int?
+  fontSettings     FontSettings?   @relation(fields: [fontSettingsId], references: [id])
+  customerId       String?         @unique
+  customer         Customer?       @relation(fields: [customerId], references: [id])
+}
+
+model Customer {
+  id          String            @default(cuid()) @id
+  slug        String            @unique
+  name        String
+  settings    CustomerSettings?
+  dialogues   Dialogue[]
+  users       User[]
+  roles       Role[]
+  permissions Permission[]
+  triggers    Trigger[]
+  tags        Tag[]
+}
+
+enum TagEnum {
+  DEFAULT
+  AGENT
+  LOCATION
+}
+
+model Tag {
+  id         String     @default(cuid()) @id
+  type       TagEnum    @default(value: DEFAULT)
+  name       String
+  isTagOf    Dialogue[] @relation(references: [id])
+  customer   Customer  @relation(fields: [customerId], references: [id])
+  customerId String
+}
+
+model Dialogue {
+  id           String         @default(cuid()) @id
+  title        String
+  slug         String
+  description  String
+  creationDate DateTime       @default(now())
+  updatedAt    DateTime?      @updatedAt
+  publicTitle  String?
+  customerId   String
+  customer     Customer       @relation(fields: [customerId], references: [id])
+  edges        Edge[]
+  questions    QuestionNode[]
+  sessions     Session[]
+  tags         Tag[]
+}
+
+enum NodeType {
+  GENERIC
+  SLIDER
+  CHOICE
+  REGISTRATION
+  TEXTBOX
+  LINK
+}
+
+model QuestionNode {
+  id                         String           @default(cuid()) @id
+  creationDate               DateTime         @default(now())
+  updatedAt                  DateTime?        @updatedAt
+  isLeaf                     Boolean          @default(false)
+  isRoot                     Boolean          @default(false)
+  title                      String
+  type                       NodeType         @default(value: GENERIC)
+  options                    QuestionOption[]
+  children                   Edge[]
+
+  overrideLeafId             String?
+  overrideLeaf               QuestionNode?    @relation("QNodeToOverrideLeaf", fields: [overrideLeafId], references: [id])
+  isOverrideLeafOf           QuestionNode[]   @relation("QNodeToOverrideLeaf")
+  
+  questionDialogue           Dialogue?        @relation(fields: [questionDialogueId], references: [id])
+  questionDialogueId         String?
+  
+  isChildNodeOf              Edge[]           @relation("Edge_childNodeToQuestionNode")
+  isParentNodeOf             Edge[]           @relation("Edge_parentNodeToQuestionNode")
+  isRelatedNodeOfNodeEntries NodeEntry[]
+  
+  edgeId                     String?
+  Edge                       Edge?            @relation("EdgeChildrenRelation", fields: [edgeId], references: [id])
+  
+  QuestionOption             QuestionOption[] @relation("QuestionNodeOptions")
+  triggers                   Trigger[]
+  links                      Link[]
+}
+
+enum LinkTypeEnum {
+  SOCIAL
+  API
+  FACEBOOK
+  LINKEDIN
+  WHATSAPP
+  INSTAGRAM
+  TWITTER
+}
+
+model Link {
+  id              String        @default(cuid()) @id
+  createdAt       DateTime      @default(now())
+  updatedAt       DateTime?     @updatedAt
+  title           String?
+  type            LinkTypeEnum
+  url             String
+  iconUrl         String?
+  backgroundColor String?
+  questionNode    QuestionNode? @relation(fields: [questionNodeId], references: [id])
+  questionNodeId  String?
+}
+
+model Edge {
+  childNodeId                String
+  createdAt                  DateTime            @default(now())
+  updatedAt                  DateTime            @updatedAt
+  id                         String              @default(cuid()) @id
+  parentNodeId               String
+  dialogueId                 String?
+  conditions                 QuestionCondition[]
+  isEdgeOf                   QuestionNode[]      @relation("EdgeChildrenRelation")
+  childNode                  QuestionNode        @relation("Edge_childNodeToQuestionNode", fields: [childNodeId], references: [id])
+  parentNode                 QuestionNode        @relation("Edge_parentNodeToQuestionNode", fields: [parentNodeId], references: [id])
+  dialogue                   Dialogue?           @relation(fields: [dialogueId], references: [id])
+  isRelatedNodeOfNodeEntries NodeEntry[]
+  questionNodeId             String?
+  QuestionNode               QuestionNode?       @relation(fields: [questionNodeId], references: [id])
+}
+
+model QuestionCondition {
+  conditionType String
+  id            Int     @default(autoincrement()) @id
+  matchValue    String?
+  renderMax     Int?
+  renderMin     Int?
+  edgeId        String?
+  Edge          Edge?   @relation(fields: [edgeId], references: [id])
+}
+
+model QuestionOption {
+  id             Int           @default(autoincrement()) @id
+  publicValue    String?
+  value          String
+  questionId     String?
+  question       QuestionNode? @relation("QuestionNodeOptions", fields: [questionId], references: [id])
+  questionNodeId String?
+  QuestionNode   QuestionNode? @relation(fields: [questionNodeId], references: [id])
+}
+
+model Session {
+  createdAt   DateTime    @default(now())
+  id          String      @default(cuid()) @id
+  dialogueId  String
+  dialogue    Dialogue    @relation(fields: [dialogueId], references: [id])
+  nodeEntries NodeEntry[]
+}
+
+// Node-entry types
+
+model NodeEntry {
+  id            String           @default(cuid()) @id
+  creationDate  DateTime         @default(now())
+  depth         Int?
+  relatedEdgeId String?
+  relatedNodeId String?
+  sessionId     String?
+  session       Session?         @relation(fields: [sessionId], references: [id])
+  relatedNode   QuestionNode?    @relation(fields: [relatedNodeId], references: [id])
+  relatedEdge   Edge?            @relation(fields: [relatedEdgeId], references: [id])
+  
+  // Entry types
+  sliderNodeEntry SliderNodeEntry?
+  choiceNodeEntry ChoiceNodeEntry?
+  textboxNodeEntry TextboxNodeEntry?
+  registrationNodeEntry RegistrationNodeEntry?
+  linkNodeEntry LinkNodeEntry?
+}
+
+model LinkNodeEntry {
+  id  Int  @default(autoincrement()) @id
+  value Json?
+  nodeEntryId String
+  nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
+}
+
+model SliderNodeEntry {
+  id  Int  @default(autoincrement()) @id
+  value Int?
+  nodeEntryId String
+  nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
+}
+
+model ChoiceNodeEntry {
+  id  Int  @default(autoincrement()) @id
+  value String?
+  nodeEntryId String
+  nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
+}
+
+model TextboxNodeEntry {
+  id  Int  @default(autoincrement()) @id
+  value String?
+  nodeEntryId String
+  nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
+}
+
+model RegistrationNodeEntry {
+  id  Int  @default(autoincrement()) @id
+  value Json?
+  nodeEntryId String
+  nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
+}
+
+// Permissions
+
+model Permission {
+  id                 String    @default(cuid()) @id
+  name               String
+  description        String?
+  isPermissionOfRole Role[]    @relation(references: [id])
+  Customer           Customer? @relation(fields: [customerId], references: [id])
+  customerId         String?
+}
+
+model Role {
+  id          String       @default(cuid()) @id
+  name        String
+  roleId      String?
+  permissions Permission[] @relation(references: [id])
+  User        User[]
+  Customer    Customer?    @relation(fields: [customerId], references: [id])
+  customerId  String?
+  @@unique([id, name])
+}
+
+model User {
+  id         String    @default(cuid()) @id
+  createdAt  DateTime  @default(now())
+  updatedAt  DateTime? @updatedAt
+  email      String
+  phone      String?
+  firstName  String?
+  lastName   String?
+  roleId     String
+  role       Role      @relation(fields: [roleId], references: [id])
+  Customer   Customer? @relation(fields: [customerId], references: [id])
+  customerId String?
+  triggers   Trigger[] @relation(references: [id])
+  @@unique([customerId, email])
+}
+
+enum TriggerEnum {
+  QUESTION
+  SCHEDULED
+}
+
+enum TriggerMedium {
+  EMAIL
+  PHONE
+  BOTH
+}
+
+enum TriggerConditionEnum {
+  LOW_THRESHOLD
+  HIGH_THRESHOLD
+  INNER_RANGE
+  OUTER_RANGE
+  TEXT_MATCH
+}
+
+model TriggerCondition {
+  id        Int                  @default(autoincrement()) @id
+  type      TriggerConditionEnum @default(value: LOW_THRESHOLD)
+  minValue  Int?
+  maxValue  Int?
+  textValue String?
+  trigger   Trigger             @relation(fields: [triggerId], references: [id])
+  triggerId String
+}
+
+model Trigger {
+  id            String             @default(cuid()) @id
+  lastSent      DateTime?
+  name          String
+  type          TriggerEnum         @default(value: QUESTION)
+  medium        TriggerMedium
+  conditions    TriggerCondition[]
+  relatedNodeId String?
+  relatedNode   QuestionNode?      @relation(fields: [relatedNodeId], references: [id])
+  recipients    User[]
+  customer      Customer?          @relation(fields: [customerId], references: [id])
+  customerId    String?
+}
```


