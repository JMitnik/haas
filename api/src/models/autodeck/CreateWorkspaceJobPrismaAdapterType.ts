import { CloudReferenceType, JobStatusType } from "@prisma/client";

export type ConfirmWorkspaceJobCreateInput = {
  id?: string
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  name?: string | null
  referenceId?: string | null
  message?: string | null
  errorMessage?: string | null
  referenceType: CloudReferenceType
  status?: JobStatusType
  resourcesUrl?: string | null
  requiresRembg?: boolean
  requiresScreenshot?: boolean
  requiresColorExtraction?: boolean
  processLocationId: string
};

export type ConfirmWorkspaceJobUpdateInput = {
  status: JobStatusType
};