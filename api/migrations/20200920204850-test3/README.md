# Migration `20200920204850-test3`

This migration has been generated at 9/20/2020, 8:48:50 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_VIEW_DIALOGUE_ANALYTICS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_VIEW_USERS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_ADD_USERS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_DELETE_USERS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_EDIT_USERS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_CREATE_TRIGGERS';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_DELETE_TRIGGERS'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920204834-test2..20200920204850-test3
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
@@ -272,15 +272,15 @@
   CAN_EDIT_DIALOGUE
   CAN_BUILD_DIALOGUE
   CAN_VIEW_DIALOGUE
   CAN_DELETE_DIALOGUE
-  // CAN_VIEW_DIALOGUE_ANALYTICS
-  // CAN_VIEW_USERS
-  // CAN_ADD_USERS
-  // CAN_DELETE_USERS
-  // CAN_EDIT_USERS
-  // CAN_CREATE_TRIGGERS
-  // CAN_DELETE_TRIGGERS
+  CAN_VIEW_DIALOGUE_ANALYTICS
+  CAN_VIEW_USERS
+  CAN_ADD_USERS
+  CAN_DELETE_USERS
+  CAN_EDIT_USERS
+  CAN_CREATE_TRIGGERS
+  CAN_DELETE_TRIGGERS
   // CAN_DELETE_WORKSPACE
   // CAN_EDIT_WORKSPACE
 }
```


