# Migration `20200713192510-added`

This migration has been generated at 7/13/2020, 7:25:10 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."QuestionNode" DROP COLUMN "type",
ADD COLUMN "type" "NodeType" NOT NULL DEFAULT E'GENERIC';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200713192355-remove-type..20200713192510-added
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
@@ -107,9 +107,9 @@
   updatedAt                  DateTime?        @updatedAt
   isLeaf                     Boolean          @default(false)
   isRoot                     Boolean          @default(false)
   title                      String
-  type                       NodeType
+  type                       NodeType         @default(value: GENERIC)
   options                    QuestionOption[]
   children                   Edge[]
   overrideLeafId             String?
```


