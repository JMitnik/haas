# Migration `20201010214422-add-fake-data-to-dialogue`

This migration has been generated at 10/10/2020, 9:44:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Dialogue" ADD COLUMN "isWithoutGenData" boolean  NOT NULL DEFAULT false;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201010194607-added-nodetype-source..20201010214422-add-fake-data-to-dialogue
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
@@ -91,8 +91,9 @@
   questions    QuestionNode[]
   sessions     Session[]
   tags         Tag[]
   isOnline     Boolean        @default(value: false)
+  isWithoutGenData Boolean @default(value: false)
   @@unique([slug, customerId])
 }
 enum NodeType {
```


