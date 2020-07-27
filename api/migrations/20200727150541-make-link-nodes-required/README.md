# Migration `20200727150541-make-link-nodes-required`

This migration has been generated at 7/27/2020, 3:05:41 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Link" ALTER COLUMN "questionNodeId" SET NOT NULL;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727141242-set-update-at-on-questionnode-to-true..20200727150541-make-link-nodes-required
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
@@ -149,10 +149,10 @@
   type            LinkTypeEnum
   url             String
   iconUrl         String?
   backgroundColor String?
-  questionNode    QuestionNode? @relation(fields: [questionNodeId], references: [id])
-  questionNodeId  String?
+  questionNodeId  String
+  questionNode    QuestionNode @relation(fields: [questionNodeId], references: [id])
 }
 model Edge {
   childNodeId                String
```


