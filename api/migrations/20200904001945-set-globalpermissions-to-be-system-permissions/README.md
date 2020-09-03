# Migration `20200904001945-set-globalpermissions-to-be-system-permissions`

This migration has been generated at 9/4/2020, 12:19:45 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_userId_fkey"

ALTER TABLE "public"."Permission" DROP COLUMN "userId";

ALTER TABLE "public"."User" ADD COLUMN "globalPermissions" "SystemPermissionEnum"[]  ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200903205443-add-system-permissions..20200904001945-set-globalpermissions-to-be-system-permissions
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
@@ -291,9 +291,9 @@
   firstName  String?
   lastName   String?
   triggers   Trigger[]
   customers  UserOfCustomer[]
-  globalPermissions Permission[]
+  globalPermissions SystemPermissionEnum[]
 }
 model UserOfCustomer {
   userId  String
```


