# Migration `20200920204820-test`

This migration has been generated at 9/20/2020, 8:48:20 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_EDIT_DIALOGUE'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920204706-reinit..20200920204820-test
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
@@ -268,9 +268,9 @@
 }
 enum SystemPermissionEnum {
   CAN_ACCESS_ADMIN_PANEL
-  // CAN_EDIT_DIALOGUE
+  CAN_EDIT_DIALOGUE
   // CAN_BUILD_DIALOGUE
   // CAN_VIEW_DIALOGUE
   // CAN_DELETE_DIALOGUE
   // CAN_VIEW_DIALOGUE_ANALYTICS
```


