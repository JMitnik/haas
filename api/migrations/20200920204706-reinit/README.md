# Migration `20200920204706-reinit`

This migration has been generated at 9/20/2020, 8:47:06 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "SystemPermissionEnum_new" AS ENUM ('CAN_ACCESS_ADMIN_PANEL');
ALTER TABLE "public"."Role" ALTER COLUMN "permissions" DROP DEFAULT,
                        ALTER COLUMN "permissions" TYPE "SystemPermissionEnum_new" USING ("permissions"::text::"SystemPermissionEnum_new"),
                        ALTER COLUMN "permissions" SET DEFAULT 'CAN_ACCESS_ADMIN_PANEL';
ALTER TABLE "public"."User" ALTER COLUMN "globalPermissions" DROP DEFAULT,
                        ALTER COLUMN "globalPermissions" TYPE "SystemPermissionEnum_new" USING ("globalPermissions"::text::"SystemPermissionEnum_new"),
                        ALTER COLUMN "globalPermissions" SET DEFAULT 'CAN_ACCESS_ADMIN_PANEL';
ALTER TYPE "SystemPermissionEnum" RENAME TO "SystemPermissionEnum_old";
ALTER TYPE "SystemPermissionEnum_new" RENAME TO "SystemPermissionEnum";
DROP TYPE "SystemPermissionEnum_old"

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
"type" "TagEnum" NOT NULL DEFAULT E'DEFAULT',
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
"isOnline" boolean  NOT NULL DEFAULT false,
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
"type" "RoleTypeEnum" NOT NULL DEFAULT E'USER',
"isPrivate" boolean  NOT NULL DEFAULT false,
"permissions" "SystemPermissionEnum"[]  ,
"customerId" text   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"id" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   ,
"email" text  NOT NULL ,
"password" text   ,
"phone" text   ,
"firstName" text   ,
"lastName" text   ,
"globalPermissions" "SystemPermissionEnum"[]  ,
"loginToken" text   ,
"loginTokenExpiry" timestamp(3)   ,
"refreshToken" text   ,
"refreshTokenExpiry" timestamp(3)   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."UserOfCustomer" (
"userId" text  NOT NULL ,
"customerId" text  NOT NULL ,
"roleId" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("userId","customerId"))

CREATE TABLE "public"."TriggerCondition" (
"id" SERIAL,
"type" "TriggerConditionEnum" NOT NULL DEFAULT E'LOW_THRESHOLD',
"minValue" integer   ,
"maxValue" integer   ,
"textValue" text   ,
"triggerId" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Trigger" (
"id" text  NOT NULL ,
"lastSent" timestamp(3)   ,
"name" text  NOT NULL ,
"type" "TriggerEnum" NOT NULL DEFAULT E'QUESTION',
"medium" "TriggerMedium" NOT NULL ,
"relatedNodeId" text   ,
"customerId" text   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."_DialogueToTag" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE TABLE "public"."_TriggerToUser" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE UNIQUE INDEX "CustomerSettings.customerId" ON "public"."CustomerSettings"("customerId")

CREATE UNIQUE INDEX "CustomerSettings_colourSettingsId" ON "public"."CustomerSettings"("colourSettingsId")

CREATE UNIQUE INDEX "CustomerSettings_fontSettingsId" ON "public"."CustomerSettings"("fontSettingsId")

CREATE UNIQUE INDEX "Customer.slug" ON "public"."Customer"("slug")

CREATE UNIQUE INDEX "Dialogue.slug_customerId" ON "public"."Dialogue"("slug","customerId")

CREATE UNIQUE INDEX "LinkNodeEntry_nodeEntryId" ON "public"."LinkNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "SliderNodeEntry_nodeEntryId" ON "public"."SliderNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "ChoiceNodeEntry_nodeEntryId" ON "public"."ChoiceNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "TextboxNodeEntry_nodeEntryId" ON "public"."TextboxNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "RegistrationNodeEntry_nodeEntryId" ON "public"."RegistrationNodeEntry"("nodeEntryId")

CREATE UNIQUE INDEX "Role.id_name" ON "public"."Role"("id","name")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "_DialogueToTag_AB_unique" ON "public"."_DialogueToTag"("A","B")

CREATE  INDEX "_DialogueToTag_B_index" ON "public"."_DialogueToTag"("B")

CREATE UNIQUE INDEX "_TriggerToUser_AB_unique" ON "public"."_TriggerToUser"("A","B")

CREATE  INDEX "_TriggerToUser_B_index" ON "public"."_TriggerToUser"("B")

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("colourSettingsId")REFERENCES "public"."ColourSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("fontSettingsId")REFERENCES "public"."FontSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."CustomerSettings" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Tag" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Dialogue" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("overrideLeafId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("questionDialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("edgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Link" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("childNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("parentNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("dialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Edge" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionCondition" ADD FOREIGN KEY ("edgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionOption" ADD FOREIGN KEY ("questionId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionOption" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Session" ADD FOREIGN KEY ("dialogueId")REFERENCES "public"."Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("sessionId")REFERENCES "public"."Session"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("relatedNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."NodeEntry" ADD FOREIGN KEY ("relatedEdgeId")REFERENCES "public"."Edge"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."LinkNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."SliderNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."ChoiceNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TextboxNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."RegistrationNodeEntry" ADD FOREIGN KEY ("nodeEntryId")REFERENCES "public"."NodeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Permission" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Role" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."UserOfCustomer" ADD FOREIGN KEY ("roleId")REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."TriggerCondition" ADD FOREIGN KEY ("triggerId")REFERENCES "public"."Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Trigger" ADD FOREIGN KEY ("relatedNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Trigger" ADD FOREIGN KEY ("customerId")REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."_DialogueToTag" ADD FOREIGN KEY ("A")REFERENCES "public"."Dialogue"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_DialogueToTag" ADD FOREIGN KEY ("B")REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_TriggerToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_TriggerToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200920204706-reinit
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,379 @@
+datasource postgresql {
+  provider = "postgresql"
+  url = "***"
+}
+
+// binaryTargets = ["debian-openssl-1.1.x"]
+generator client {
+  provider = "prisma-client-js"
+  previewFeatures = ["middlewares"]
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
+  users       UserOfCustomer[]
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
+  isOnline     Boolean        @default(value: false)
+  @@unique([slug, customerId])
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
+  updatedAt                  DateTime         @updatedAt
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
+model Permission {
+  id                 String    @default(cuid()) @id
+  name               String
+  description        String?
+  Customer           Customer? @relation(fields: [customerId], references: [id])
+  customerId         String?
+}
+
+enum SystemPermissionEnum {
+  CAN_ACCESS_ADMIN_PANEL
+  // CAN_EDIT_DIALOGUE
+  // CAN_BUILD_DIALOGUE
+  // CAN_VIEW_DIALOGUE
+  // CAN_DELETE_DIALOGUE
+  // CAN_VIEW_DIALOGUE_ANALYTICS
+  // CAN_VIEW_USERS
+  // CAN_ADD_USERS
+  // CAN_DELETE_USERS
+  // CAN_EDIT_USERS
+  // CAN_CREATE_TRIGGERS
+  // CAN_DELETE_TRIGGERS
+  // CAN_DELETE_WORKSPACE
+  // CAN_EDIT_WORKSPACE
+}
+
+enum RoleTypeEnum {
+  ADMIN
+  MANAGER
+  USER
+  GUEST
+  CUSTOM
+}
+
+model Role {
+  id          String       @default(cuid()) @id
+  name        String
+  type        RoleTypeEnum  @default(value: USER)
+  isPrivate   Boolean       @default(false)
+  permissions SystemPermissionEnum[]
+  users       UserOfCustomer[]
+  @@unique([id, name])
+}
+
+model User {
+  id         String    @default(cuid()) @id
+  createdAt  DateTime  @default(now())
+  updatedAt  DateTime? @updatedAt
+  email      String    @unique
+  password   String?
+  phone      String?
+  firstName  String?
+  lastName   String?
+  triggers   Trigger[]
+  customers  UserOfCustomer[]
+  globalPermissions SystemPermissionEnum[]
+  loginToken  String?
+  loginTokenExpiry DateTime?
+  refreshToken  String? 
+  refreshTokenExpiry  DateTime? 
+}
+
+model UserOfCustomer {
+  userId  String
+  user    User    @relation(fields: [userId], references: [id])
+
+  customerId String
+  customer  Customer  @relation(fields: [customerId], references: [id])
+
+  roleId  String
+  role    Role  @relation(fields: [roleId], references: [id])
+  
+  createdAt DateTime @default(now())
+
+  @@id([userId, customerId])
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


