# Migration `20200903205443-add-system-permissions`

This migration has been generated at 9/3/2020, 8:54:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "SystemPermissionEnum" AS ENUM ('CAN_ACCESS_ADMIN_PANEL', 'CAN_BUILD_DIALOGUES', 'CAN_VIEW_DIALOGUES');

ALTER TABLE "public"."_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey"

ALTER TABLE "public"."_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey"

ALTER TABLE "public"."Permission" ADD COLUMN "userId" text   ;

ALTER TABLE "public"."Role" ADD COLUMN "permissions" "SystemPermissionEnum"[]  ;

ALTER TABLE "public"."User" DROP COLUMN "isSuperAdmin";

ALTER TABLE "public"."Permission" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

DROP TABLE "public"."_PermissionToRole";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200826203246-start-from-zero..20200903205443-add-system-permissions
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
@@ -257,23 +257,27 @@
   nodeEntry NodeEntry @relation(references: [id], fields: [nodeEntryId])
 }
 // Permissions
-
 model Permission {
   id                 String    @default(cuid()) @id
   name               String
   description        String?
-  isPermissionOfRole Role[]    @relation(references: [id])
   Customer           Customer? @relation(fields: [customerId], references: [id])
   customerId         String?
 }
+enum SystemPermissionEnum {
+  CAN_ACCESS_ADMIN_PANEL
+  CAN_BUILD_DIALOGUES
+  CAN_VIEW_DIALOGUES
+}
+
 model Role {
   id          String       @default(cuid()) @id
   name        String
   roleId      String?
-  permissions Permission[] @relation(references: [id])
+  permissions SystemPermissionEnum[]
   users       UserOfCustomer[]
   @@unique([id, name])
 }
@@ -287,9 +291,9 @@
   firstName  String?
   lastName   String?
   triggers   Trigger[]
   customers  UserOfCustomer[]
-  isSuperAdmin  Boolean @default(false)
+  globalPermissions Permission[]
 }
 model UserOfCustomer {
   userId  String
```


