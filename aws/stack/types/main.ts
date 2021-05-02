/**
 * Context-type for the AWS stacks
 */
export interface ContextType {
  accountId: string;
  region: string;
  services: ContextServicesType;
}

export interface ContextCampaignServiceType {
  deliveryTableName: string;
}

export interface ContextServicesType {
  campaign: ContextCampaignServiceType
}