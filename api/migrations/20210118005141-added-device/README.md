# Migration `20210118005141-added-device`

This migration has been generated by Jonathan at 1/18/2021, 1:51:41 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Session" ADD COLUMN "device" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210118001822-added-delivery-tracking..20210118005141-added-device
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
@@ -312,8 +312,9 @@
   delivery   Delivery? @relation(fields: [deliveryId], references: [id])
   originUrl      String?
   totalTimeInSec Int?
+  device         String?
 }
 // Node-entry types
 enum InputSource {
```

