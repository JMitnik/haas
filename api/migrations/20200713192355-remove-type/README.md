# Migration `20200713192355-remove-type`

This migration has been generated at 7/13/2020, 7:23:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."NodeEntry" DROP COLUMN "type";

ALTER TABLE "public"."QuestionNode" DROP COLUMN "type",
ADD COLUMN "type" "NodeType" NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200709152924..20200713192355-remove-type
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
@@ -91,28 +91,42 @@
   sessions     Session[]
   tags         Tag[]
 }
+enum NodeType {
+  GENERIC
+  SLIDER
+  CHOICE
+  REGISTRATION
+  TEXTBOX
+  LINK
+}
+
 model QuestionNode {
   id                         String           @default(cuid()) @id
   creationDate               DateTime         @default(now())
   updatedAt                  DateTime?        @updatedAt
   isLeaf                     Boolean          @default(false)
   isRoot                     Boolean          @default(false)
   title                      String
-  type                       String
+  type                       NodeType
   options                    QuestionOption[]
   children                   Edge[]
+
   overrideLeafId             String?
   overrideLeaf               QuestionNode?    @relation("QNodeToOverrideLeaf", fields: [overrideLeafId], references: [id])
   isOverrideLeafOf           QuestionNode[]   @relation("QNodeToOverrideLeaf")
+  
   questionDialogue           Dialogue?        @relation(fields: [questionDialogueId], references: [id])
   questionDialogueId         String?
+  
   isChildNodeOf              Edge[]           @relation("Edge_childNodeToQuestionNode")
   isParentNodeOf             Edge[]           @relation("Edge_parentNodeToQuestionNode")
   isRelatedNodeOfNodeEntries NodeEntry[]
+  
   edgeId                     String?
   Edge                       Edge?            @relation("EdgeChildrenRelation", fields: [edgeId], references: [id])
+  
   QuestionOption             QuestionOption[] @relation("QuestionNodeOptions")
   triggers                   Trigger[]
 }
@@ -162,29 +176,20 @@
 }
 // Node-entry types
-enum NodeType {
-  GENERIC
-  SLIDER
-  CHOICE
-  REGISTRATION
-  TEXTBOX
-  LINK
-}
-
 model NodeEntry {
   id            String           @default(cuid()) @id
   creationDate  DateTime         @default(now())
-  type          NodeType         @default(value: GENERIC)
   depth         Int?
   relatedEdgeId String?
   relatedNodeId String?
   sessionId     String?
   session       Session?         @relation(fields: [sessionId], references: [id])
   relatedNode   QuestionNode?    @relation(fields: [relatedNodeId], references: [id])
   relatedEdge   Edge?            @relation(fields: [relatedEdgeId], references: [id])
+  // Entry types
   sliderNodeEntry SliderNodeEntry?
   choiceNodeEntry ChoiceNodeEntry?
   textboxNodeEntry TextboxNodeEntry?
   registrationNodeEntry RegistrationNodeEntry?
@@ -225,8 +230,10 @@
   nodeEntryId String
   nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
 }
+// Permissions
+
 model Permission {
   id                 String    @default(cuid()) @id
   name               String
   description        String?
```


