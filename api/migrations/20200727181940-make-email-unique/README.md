# Migration `20200727181940-make-email-unique`

This migration has been generated at 7/27/2020, 6:19:40 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200727181719-add-super-admin..20200727181940-make-email-unique
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
@@ -278,9 +278,9 @@
 model User {
   id         String    @default(cuid()) @id
   createdAt  DateTime  @default(now())
   updatedAt  DateTime? @updatedAt
-  email      String
+  email      String    @unique
   password   String
   phone      String?
   firstName  String?
   lastName   String?
```


