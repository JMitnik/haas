# Migration `20200727164736-user-customer-to-many-to-many`

This migration has been generated at 7/27/2020, 4:47:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
DROP INDEX "public"."User.customerId_email"

ALTER TABLE "public"."User" DROP CONSTRAINT "User_customerId_fkey"

CREATE TABLE "public"."_CustomerToUser" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

ALTER TABLE "public"."User" DROP COLUMN "customerId";

CREATE UNIQUE INDEX "_CustomerToUser_AB_unique" ON "public"."_CustomerToUser"("A","B")

CREATE  INDEX "_CustomerToUser_B_index" ON "public"."_CustomerToUser"("B")

ALTER TABLE "public"."_CustomerToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Customer"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_CustomerToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727150638..20200727164736-user-customer-to-many-to-many
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
@@ -287,12 +287,10 @@
   firstName  String?
   lastName   String?
   roleId     String
   role       Role      @relation(fields: [roleId], references: [id])
-  Customer   Customer? @relation(fields: [customerId], references: [id])
-  customerId String?
+  Customer   Customer[]
   triggers   Trigger[] @relation(references: [id])
-  @@unique([customerId, email])
 }
 enum TriggerEnum {
   QUESTION
```


