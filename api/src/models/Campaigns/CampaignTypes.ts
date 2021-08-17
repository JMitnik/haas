import { DeliveryStatusTypeEnum, Prisma } from '@prisma/client';


const campaignVariant = Prisma.validator<Prisma.CampaignVariantArgs>()({
  include: {
    dialogue: true,
    workspace: true,
    customVariables: true,
  }
});

export type CampaignVariant = Prisma.CampaignVariantGetPayload<typeof campaignVariant>;

const campaignWithVariantsAndDeliveries = Prisma.validator<Prisma.CampaignArgs>()({
  include: {
    deliveries: true,
    variantsEdges: {
      include: {
        campaignVariant: {
          include: {
            dialogue: true,
            workspace: true,
            customVariables: true,
          }
        },
      }
    }
  }
});

export type CampaignWithVariants = Prisma.CampaignGetPayload<typeof campaignWithVariantsAndDeliveries>


export interface DeliveryOptionsProps {
  status?: DeliveryStatusTypeEnum;
  variantId?: string;
}

export interface DeliveryUpdateItemProps {
  dateId: string;
  oldStatus: DeliveryStatusTypeEnum;
  newStatus: DeliveryStatusTypeEnum;
}

export interface ErroredRecord {
  record: any;
  error: string;
}

export interface ValidateDeliveryRecordsResults {
  erroredRecords: ErroredRecord[];
  successRecords: CSVDeliveryRow[];
}

export interface CSVDeliveryRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  prefix?: string;
}


// TODO: Replace with GRAPHQL type
export interface DeliveryInput {
  id: string;
  campaignVariantId: string;
  customVariables: Record<string, any>;
  campaignId: string;
  currentStatus: DeliveryStatusTypeEnum;
  scheduledAt: Date;
  prefix?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface DeliveryCSVProcessRecord extends DeliveryInput {
  variant?: CampaignVariant;
  scheduleKey?: string;
  body?: string;
  from?: string;
  scheduleKeyId?: string;
}
