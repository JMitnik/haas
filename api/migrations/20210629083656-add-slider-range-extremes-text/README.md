# Migration `20210629083656-add-slider-range-extremes-text`

This migration has been generated at 6/29/2021, 10:36:56 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."SliderNode" ADD COLUMN "unhappyText" text   ,
ADD COLUMN "happyText" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210603185651-prisma-refresh..20210629083656-add-slider-range-extremes-text
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
@@ -189,9 +189,10 @@
 model SliderNode {
   id           String             @id @default(cuid())
   markers      SliderNodeMarker[]
   QuestionNode QuestionNode[]
-
+  unhappyText String?
+  happyText String?
   earlyReleaseText String?
 }
 model VideoEmbeddedNode {
```


