# Migration `20200924165905-added-datetime`

This migration has been generated at 9/24/2020, 4:59:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "lastActivity" timestamp(3)   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920204900-test4..20200924165905-added-datetime
--- datamodel.dml
+++ datamodel.dml
@@ -1,13 +1,13 @@
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 // binaryTargets = ["debian-openssl-1.1.x"]
 generator client {
   provider = "prisma-client-js"
-  previewFeatures = ["middlewares"]
+  previewFeatures = ["middlewares", "transactionApi"]
   output   = "./node_modules/@prisma/client"
 }
 model ColourSettings {
@@ -317,8 +317,9 @@
   loginToken  String?
   loginTokenExpiry DateTime?
   refreshToken  String? 
   refreshTokenExpiry  DateTime? 
+  lastActivity DateTime?
 }
 model UserOfCustomer {
   userId  String
```


