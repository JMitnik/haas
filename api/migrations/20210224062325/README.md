# Migration `20210224062325`

This migration has been generated by Jonathan at 2/24/2021, 7:23:25 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."QuestionNode" ADD COLUMN "questionNodeId" text   

ALTER TABLE "public"."QuestionOption" ADD COLUMN "overrideLeafId" text   

ALTER TABLE "public"."QuestionNode" ADD FOREIGN KEY ("questionNodeId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."QuestionOption" ADD FOREIGN KEY ("overrideLeafId")REFERENCES "public"."QuestionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210118005141-added-device..20210224062325
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
@@ -206,17 +206,19 @@
   questionDialogue   Dialogue? @relation(fields: [questionDialogueId], references: [id])
   questionDialogueId String?
+
   isChildNodeOf              Edge[]      @relation("Edge_childNodeToQuestionNode")
   isParentNodeOf             Edge[]      @relation("Edge_parentNodeToQuestionNode")
   isRelatedNodeOfNodeEntries NodeEntry[]
   edgeId String?
   Edge   Edge?   @relation("EdgeChildrenRelation", fields: [edgeId], references: [id])
-  QuestionOption QuestionOption[] @relation("QuestionNodeOptions")
-  triggers       Trigger[]
+  QuestionOption   QuestionOption[] @relation("QuestionNodeOptions")
+  triggers         Trigger[]
+  overridesChoices QuestionNode[]   @relation("ChoiceCTANode")
   // Node-types
   share      Share?
   sliderNode SliderNode? @relation(fields: [sliderNodeId], references: [id])
@@ -225,8 +227,10 @@
   links             Link[]
   QuestionOfTrigger QuestionOfTrigger[]
   sliderNodeId      String?
   formNodeId        String?
+  QuestionNode      QuestionNode?       @relation("ChoiceCTANode", fields: [questionNodeId], references: [id])
+  questionNodeId    String?
 }
 enum LinkTypeEnum {
   SOCIAL
@@ -291,13 +295,18 @@
   Edge          Edge?   @relation(fields: [edgeId], references: [id])
 }
 model QuestionOption {
-  id             Int           @id @default(autoincrement())
-  publicValue    String?
-  value          String
-  questionId     String?
-  question       QuestionNode? @relation("QuestionNodeOptions", fields: [questionId], references: [id])
+  id          Int     @id @default(autoincrement())
+  publicValue String?
+  value       String
+
+  overrideLeafId String?
+  overrideLeaf   QuestionNode? @relation("ChoiceCTANode", fields: [overrideLeafId], references: [id])
+
+  questionId String?
+  question   QuestionNode? @relation("QuestionNodeOptions", fields: [questionId], references: [id])
+
   questionNodeId String?
   QuestionNode   QuestionNode? @relation(fields: [questionNodeId], references: [id])
 }
```

