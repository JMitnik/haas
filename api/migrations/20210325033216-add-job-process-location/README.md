# Migration `20210325033216-add-job-process-location`

This migration has been generated by Cold-A-Muse at 3/25/2021, 10:32:16 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."CreateWorkspaceJob" ADD COLUMN "jobProcessLocationId" text   NOT NULL 

CREATE TABLE "public"."JobProcessLocation" (
"id" text   NOT NULL ,
"name" text   NOT NULL ,
"path" text   NOT NULL ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."CreateWorkspaceJob" ADD FOREIGN KEY ("jobProcessLocationId")REFERENCES "public"."JobProcessLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210324100048-fresh-start..20210325033216-add-job-process-location
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
@@ -189,9 +189,9 @@
   id           String             @id @default(cuid())
   markers      SliderNodeMarker[]
   QuestionNode QuestionNode[]
-  earlyReleaseText  String?
+  earlyReleaseText String?
 }
 model QuestionNode {
   id           String           @id @default(cuid())
@@ -220,9 +220,9 @@
   Edge   Edge?   @relation("EdgeChildrenRelation", fields: [edgeId], references: [id])
   QuestionOption   QuestionOption[] @relation("QuestionNodeOptions")
   triggers         Trigger[]
-  overridesChoices QuestionOption[]   @relation("ChoiceCTANode")
+  overridesChoices QuestionOption[] @relation("ChoiceCTANode")
   // Node-types
   share      Share?
   sliderNode SliderNode? @relation(fields: [sliderNodeId], references: [id])
@@ -572,8 +572,15 @@
   COMPLETED
   FAILED
 }
+model JobProcessLocation {
+  id   String               @id @default(cuid())
+  name String
+  path String
+  job  CreateWorkspaceJob[]
+}
+
 model CreateWorkspaceJob {
   id                      String             @id @default(cuid())
   createdAt               DateTime?          @default(now())
   updatedAt               DateTime?          @updatedAt
@@ -585,8 +592,10 @@
   requiresRembg           Boolean            @default(true)
   requiresScreenshot      Boolean            @default(true)
   requiresColorExtraction Boolean            @default(true)
   Job                     Job
+  processLocation         JobProcessLocation @relation(fields: [jobProcessLocationId], references: [id])
+  jobProcessLocationId    String
 }
 // Campaigns
 enum CampaignVariantTypeEnum {
```

