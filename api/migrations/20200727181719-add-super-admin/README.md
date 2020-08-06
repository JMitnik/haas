# Migration `20200727181719-add-super-admin`

This migration has been generated at 7/27/2020, 6:17:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "isSuperAdmin" boolean  NOT NULL DEFAULT false;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727180727-set-triggers-back..20200727181719-add-super-admin
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
@@ -285,8 +285,9 @@
   firstName  String?
   lastName   String?
   triggers   Trigger[]
   customers  UserOfCustomer[]
+  isSuperAdmin  Boolean @default(false)
 }
 model UserOfCustomer {
   userId  String
```


