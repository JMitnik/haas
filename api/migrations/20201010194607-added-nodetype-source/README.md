# Migration `20201010194607-added-nodetype-source`

This migration has been generated at 10/10/2020, 7:46:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "InputSource" AS ENUM ('CLIENT', 'INIT_GENERATED');

ALTER TABLE "public"."NodeEntry" ADD COLUMN "inputSource" "InputSource" NOT NULL DEFAULT E'CLIENT';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200928175201-yea..20201010194607-added-nodetype-source
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
@@ -219,8 +219,12 @@
   nodeEntries NodeEntry[]
 }
 // Node-entry types
+enum InputSource {
+  CLIENT
+  INIT_GENERATED
+}
 model NodeEntry {
   id            String        @default(cuid()) @id
   creationDate  DateTime      @default(now())
@@ -230,8 +234,9 @@
   sessionId     String?
   session       Session?      @relation(fields: [sessionId], references: [id])
   relatedNode   QuestionNode? @relation(fields: [relatedNodeId], references: [id])
   relatedEdge   Edge?         @relation(fields: [relatedEdgeId], references: [id])
+  inputSource   InputSource   @default(value: CLIENT)
   // Entry types
   sliderNodeEntry       SliderNodeEntry?
   choiceNodeEntry       ChoiceNodeEntry?
```


