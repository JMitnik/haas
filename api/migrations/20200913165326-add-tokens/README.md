# Migration `20200913165326-add-tokens`

This migration has been generated at 9/13/2020, 4:53:26 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "loginToken" text   ,
ADD COLUMN "loginTokenExpiry" timestamp(3)   ,
ADD COLUMN "refreshToken" text   ,
ADD COLUMN "refreshTokenExpiry" timestamp(3)   ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200904001945-set-globalpermissions-to-be-system-permissions..20200913165326-add-tokens
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
@@ -292,8 +292,12 @@
   lastName   String?
   triggers   Trigger[]
   customers  UserOfCustomer[]
   globalPermissions SystemPermissionEnum[]
+  loginToken  String?
+  loginTokenExpiry DateTime?
+  refreshToken  String? 
+  refreshTokenExpiry  DateTime? 
 }
 model UserOfCustomer {
   userId  String
```


