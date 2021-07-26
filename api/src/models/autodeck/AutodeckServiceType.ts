export type ScreenshotProps = {
  websiteUrl: string;
  bucket: string;
  jobId: string;
  requiresRembg: boolean | null | undefined;
  requiresScreenshot: boolean | null | undefined;
  requiresColorExtraction: boolean | null | undefined;
};

export interface CreateWorkspaceJobProps {
  id?: string | null;
  name?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  answer1?: string | null;
  answer2?: string | null;
  answer3?: string | null;
  answer4?: string | null;
  firstName?: string | null;
  primaryColour?: string | null;
  requiresRembg?: boolean | null;
  requiresWebsiteScreenshot?: boolean | null;
  requiresColorExtraction?: boolean | null;
  usesAdjustedLogo?: boolean | null;
  jobLocationId?: string | null;
}