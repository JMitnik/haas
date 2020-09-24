# Migration `20200920204900-test4`

This migration has been generated at 9/20/2020, 8:49:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_DELETE_WORKSPACE';
ALTER TYPE "SystemPermissionEnum" ADD VALUE 'CAN_EDIT_WORKSPACE'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920204850-test3..20200920204900-test4
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
@@ -279,10 +279,10 @@
   CAN_DELETE_USERS
   CAN_EDIT_USERS
   CAN_CREATE_TRIGGERS
   CAN_DELETE_TRIGGERS
-  // CAN_DELETE_WORKSPACE
-  // CAN_EDIT_WORKSPACE
+  CAN_DELETE_WORKSPACE
+  CAN_EDIT_WORKSPACE
 }
 enum RoleTypeEnum {
   ADMIN
```


