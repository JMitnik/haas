export interface UpdateCustomerInput {
  name: string;
  slug: string;
  logoUrl?: string | null;
  logoOpacity?: number | null;
  primaryColour?: string | null;
}

export type WorkspaceTemplateType = 'DEFAULT' | 'BUSINESS' | 'SPORT';
