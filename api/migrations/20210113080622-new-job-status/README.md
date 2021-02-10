# Migration `20210113080622-new-job-status`

This migration has been generated by Cold-A-Muse at 1/13/2021, 3:06:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "JobStatusType" ADD VALUE 'READY_FOR_PROCESSING'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210113075845-added-two-extra-job-statuses..20210113080622-new-job-status
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
@@ -537,8 +537,9 @@
 enum JobStatusType {
   PRE_PROCESSING
   PRE_PROCESSING_LOGO
   PRE_PROCESSING_WEBSITE_SCREENSHOT
+  READY_FOR_PROCESSING
   IN_PHOTOSHOP_QUEUE 
   PHOTOSHOP_PROCESSING
   PENDING
   COMPLETED
```

