# Migration `20200727141242-set-update-at-on-questionnode-to-true`

This migration has been generated at 7/27/2020, 2:12:42 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."QuestionNode" ALTER COLUMN "updatedAt" SET NOT NULL;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727140842-add-password-to-user..20200727141242-set-update-at-on-questionnode-to-true
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
@@ -103,9 +103,9 @@
 model QuestionNode {
   id                         String           @default(cuid()) @id
   creationDate               DateTime         @default(now())
-  updatedAt                  DateTime?        @updatedAt
+  updatedAt                  DateTime         @updatedAt
   isLeaf                     Boolean          @default(false)
   isRoot                     Boolean          @default(false)
   title                      String
   type                       NodeType         @default(value: GENERIC)
```


