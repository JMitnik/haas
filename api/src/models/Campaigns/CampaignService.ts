import { addDays, format } from 'date-fns';
import { uniqueId } from 'lodash';
import { UserInputError } from 'apollo-server-express';

import prisma from '../../config/prisma';
import AWS from '../../config/aws';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { CampaignVariantTypeEnum, Prisma, PrismaClient } from '@prisma/client';
import { CampaignPrismaAdapter } from './CampaignPrismaAdapter';
import { CampaignVariant, CampaignWithVariants, CSVDeliveryRow, DeliveryCSVProcessRecord, DeliveryInput, DeliveryOptionsProps, DeliveryUpdateItemProps, ErroredRecord, ValidateDeliveryRecordsResults } from './CampaignTypes';
import { parseCsv } from '../../utils/parseCsv';
import { nanoid } from 'nanoid';
import { probability } from '../../utils/probability';
import mustache from 'mustache';
import { isPresent } from 'ts-is-present';
import DynamoScheduleService from '../../services/DynamoScheduleService';

export class CampaignService {
  prisma: PrismaClient;
  prismaAdapter: CampaignPrismaAdapter;
  dynamoScheduleService: DynamoScheduleService;

  constructor(prisma: PrismaClient, dynamoScheduleService: DynamoScheduleService) {
    this.prisma = prisma;
    this.prismaAdapter = new CampaignPrismaAdapter(prisma);
    this.dynamoScheduleService = dynamoScheduleService;
  }

  /**
   * Create a campaign.
   */
  createCampaign = async (input: NexusGenInputs['CreateCampaignInputType']) => {
    this.validateCampaignEdges(input);

    return this.prismaAdapter.createCampaign(input);
  }

  /**
   * Find all campaigns of workspace.
   */
  findCampaignsOfWorkspace = async (workspaceId: string) => {
    return this.prismaAdapter.findCampaignsOfWorkspace(workspaceId);
  }

  /**
   * Find delivery of session.
   * @param campaignId
   * @returns
   */
  findDeliveryOfSession = async (sessionId: string) => {
    return this.prismaAdapter.findDeliveryOfSession(sessionId);
  }

  /**
   * Find delivery-events of delivery.
   */
  findDeliveryEventsOfDelivery = async (deliveryId: string) => {
    return this.prismaAdapter.findDeliveryEventsOfDelivery(deliveryId);
  }

  /**
   *
   * @param campaignId
   * @returns
   */

  /**
   * Find campaign by ID.
   */
  findCampaign = async (campaignId: string): Promise<CampaignWithVariants | null> => {
    return this.prismaAdapter.findCampaign(campaignId);
  }

  validateCampaignEdges = (input: NexusGenInputs['CreateCampaignInputType']) => {
    const weights = input.variants?.map((variant) => variant.weight).filter(isPresent) || [];
    const totalWeight = weights?.reduce((total, weight) => total + weight);

    // Since approximation, let's do it like this
    if (totalWeight !== 100) {
      throw new UserInputError('Weights do not sum up to 100%');
    }
  }

  /**
   * Gets paginated deliveries given a `campaignId`, generic `paginationOptions` and specific
   * delivery-centric access options.
   * @param campaignId
   * @param paginationOptions
   */
  getPaginatedDeliveries<GenericModelType>(
    campaignId: string,
    paginationOptions?: NexusGenInputs['PaginationWhereInput'],
    deliveryOptions?: DeliveryOptionsProps
  ) {
    const deliveryFilterOptions: Prisma.DeliveryFindManyArgs = {
      where: {
        campaignId,
        currentStatus: deliveryOptions?.status || undefined,
        campaignVariant: (!!deliveryOptions || undefined) && {
          id: deliveryOptions?.variantId
        },
      },
    };

    const findManyDeliveriesCallback = ({ props: findManyArgs }: FindManyCallBackProps) => this.prisma.delivery.findMany({
      ...findManyArgs,
      include: {
        events: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    const countDeliveriesCallback = async ({ props: countArgs }: FindManyCallBackProps) => this.prisma.delivery.count(countArgs);

    const deliveryPaginationOptions: PaginateProps = {
      findManyArgs: {
        findArgs: deliveryFilterOptions,
        findManyCallBack: findManyDeliveriesCallback,
        searchFields: [],
        orderFields: ['updatedAt', 'scheduledAt', 'firstName'],
      },
      countArgs: {
        countCallBack: countDeliveriesCallback,
        countWhereInput: deliveryFilterOptions
      },
      paginationOpts: paginationOptions,
      useSlice: false
    };

    return paginate<GenericModelType>(deliveryPaginationOptions);
  }

  /**
   * Fetches general statistics about a specific collection
   * @param deliveries
   */
  getStatisticsFromDeliveries(
    deliveries: NexusGenFieldTypes['DeliveryType'][],
  ) {
    return {
      nrTotal: deliveries.length,
      nrFinished: deliveries.filter(entry => entry.currentStatus === 'FINISHED').length,
      nrOpened: deliveries.filter(entry => entry.currentStatus === 'OPENED' || entry.currentStatus === 'FINISHED').length,
      nrSent: deliveries.filter(entry => entry.currentStatus === 'DEPLOYED' || entry.currentStatus === 'SENT').length
    }
  }

  /**
   * Create a delivery in Prisma.
   */
  createDelivery = async (input: DeliveryInput) => {
    return this.prismaAdapter.createDelivery(input);
  }

  /**
   * Create a batch of deliveries.
   */
  createBatchDeliveries = async (
    campaignId: string,
    csvRecords: any[],
    scheduledTimeStamp: string,
    callbackUrl: string
  ): Promise<NexusGenFieldTypes['CreateBatchDeliveriesOutputType']> => {
    const campaign = await this.findCampaign(campaignId);
    if (!campaign) throw new UserInputError('Related campaign does not exist');

    // Pick out correct rows, and preprocess them in the corresponding format.
    const { successRecords, erroredRecords } = this.validateDeliveryRows(
      csvRecords,
      campaign.variantsEdges.map(variantEdge => variantEdge.campaignVariant)
    );
    const deliveryRecords = this.preprocessDeliveryCSVRows(campaign, successRecords, scheduledTimeStamp);

    // Save deliveries to prisma.
    const createdDatabaseRecords = await Promise.all(deliveryRecords.map(async record => {
      try {
        await this.prismaAdapter.createDelivery(record);
        return true;
      } catch (error) {
        console.error(`Error encountered in creating database record: ${error}`);
        return false;
      }
    }));

    // Send deliveries as jobs to Dynamo.
    await this.deployDeliveryJobs(deliveryRecords, callbackUrl);

    return {
      nrDeliveries: createdDatabaseRecords.filter((item) => item).length,
      failedDeliveries: erroredRecords,
    };
  };

  /**
   * Send delivery jobs to Dynamo.
   */
  deployDeliveryJobs = async (
    deliveryRecords: DeliveryCSVProcessRecord[],
    callbackUrl: string,
    tableName: string = 'CampaignDeliveries'
  ) => {
    await this.dynamoScheduleService.batchScheduleOneOffs(deliveryRecords.map(record => ({
      attributes: [
        {
          key: 'DeliveryDate',
          value: record.scheduleKey || '',
          type: 'string'
        },
        {
          key: 'DeliveryDate_DeliveryID',
          value: record.scheduleKeyId || '',
          type: 'string'
        },
        {
          key: 'DeliveryRecipient',
          type: 'string',
          value: (record.variant?.type === 'EMAIL' ? record.email : record.phoneNumber) || ''
        },
        {
          key: 'DeliveryBody',
          type: 'string',
          value: record.body || ''
        },
        {
          key: 'DeliveryFrom',
          type: 'string',
          value: record.from || '',
        },
        {
          key: 'DeliveryStatus',
          type: 'string',
          value: 'SCHEDULED',
        },
        {
          key: 'DeliveryType',
          type: 'string',
          value: record.variant?.type || ''
        },
        {
          key: 'callback',
          type: 'string',
          value: callbackUrl || ''
        },
        {
          key: 'phoneNumber',
          type: 'string',
          value: record.phoneNumber || ''
        },
      ]
    })), { tableName });
  };

  /**
   * Update a batch of deliveries
   */
  static async updateBatchDeliveryStatus(updatedDeliveries: DeliveryUpdateItemProps[]) {
    const deliveryUpdates = updatedDeliveries.map(delivery => {
      const id = delivery.dateId.slice(delivery.dateId.length - 10);

      const updateDelivery = prisma.delivery.update({
        where: { id },
        data: {
          currentStatus: delivery.newStatus,
        }
      });

      const newEvent = prisma.deliveryEvents.create({
        data: {
          status: delivery.newStatus,
          Delivery: { connect: { id } },
          failureMessage: delivery?.failureMessage || undefined
        }
      });

      return [updateDelivery, newEvent];
    });

    const deliveries = deliveryUpdates.flat();

    // @ts-ignore
    return await prisma.$transaction(deliveries);
  }

  /**
    * Validates uploaded CSV based on the following rules:
    * - If only EMAIL campaigns exist, require a record to have `phone`
    * - If only SMS campaigns exist, require a record to have `email`
   */
  validateDeliveryRows = (
    csvRecords: any[],
    campaignVariants: CampaignVariant[],
  ): ValidateDeliveryRecordsResults => {
    const requiresEmail = campaignVariants.filter((variant) => variant.type === 'EMAIL').length === campaignVariants.length;
    const requiresPhone = campaignVariants.filter((variant) => variant.type === 'SMS').length === campaignVariants.length;

    const erroredRecords: ErroredRecord[] = [];
    const successRecords: CSVDeliveryRow[] = [];

    csvRecords.forEach((record) => {
      if (requiresEmail && !record.email) {
        erroredRecords.push({ error: 'No email present', record: JSON.stringify(record) });
        return;
      }

      if (requiresPhone && !record.phone) {
        erroredRecords.push({ error: 'No phone number present', record: JSON.stringify(record) });
        return;
      }

      const customVariables = this.extractCustomVariablesFromCSVRecord(campaignVariants, record);

      successRecords.push({
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        phoneNumber: record.phone,
        prefix: record.prefix || '',
        ...customVariables
      });
    });

    return {
      erroredRecords,
      successRecords,
    };
  }

  /**
   * Preprocess delivery records from a CSV.
   */
  preprocessDeliveryCSVRows = (
    campaign: CampaignWithVariants,
    deliveryCSVRows: any[],
    scheduledTimestamp: string,
  ): DeliveryCSVProcessRecord[] => {
    return deliveryCSVRows.map(record => {
      // Generate unique ID
      const id = nanoid(10);

      // Derive the scheduleKey (dayMonthYear) and scheduleKeyId (timestamp_uniqueId)
      const scheduledDate = new Date(scheduledTimestamp);
      const scheduleKey = format(scheduledDate, 'ddMMyyyy');
      const scheduleKeyId = `${scheduledDate.toISOString()}_${id}`;

      // Assign a campaign variant
      const useFirstVariant = probability(campaign.variantsEdges[0].weight / 100);
      const variant = useFirstVariant ? campaign.variantsEdges[0].campaignVariant : campaign.variantsEdges[1].campaignVariant;

      const dialogueUrl = `https://client.haas.live/_r?ref=${id} `;

      // Derive body of variant based on present data
      const templateBody = variant.body.replace(/\{\{([^\}]*)\}\}/g, '{{{$1}}}');

      const customVariables = this.extractCustomVariablesFromCSVRecord(
        campaign.variantsEdges.map(variant => variant.campaignVariant),
        record
      );

      const body = this.renderBody(templateBody, {
        firstName: record.firstName,
        lastName: record.lastName,
        prefix: record.prefix || '',
        dialogueUrl,
        dialogueName: variant?.dialogue?.title || '',
        workspaceName: variant?.workspace?.name || '',
        ...customVariables
      });

      const from = variant.from;

      return {
        ...record,
        campaignId: campaign.id,
        campaignVariantId: variant.id,
        currentStatus: 'SCHEDULED',
        scheduledAt: scheduledDate,
        customVariables,
        id,
        scheduleKey,
        variant,
        body,
        from,
        scheduleKeyId,
      }
    });
  }

  /**
   * Renders delivery body based on template and variables.
   */
  renderBody(template: string, variables: any) {
    return mustache.render(template, variables);
  }

  /**
   * Extracts custom variables from a record, based on the allowed custom-variables on a variant.
   */
  extractCustomVariablesFromCSVRecord = (campaignVariants: CampaignVariant[], record: any) => {
    const allCustomVariables = campaignVariants.map(variant => variant.customVariables.map(variable => variable.key)).flat();

    const keyValues = Object.entries(record);
    const customKeyValues = keyValues.filter(([key, value]) => allCustomVariables.includes(key));

    return Object.fromEntries(customKeyValues);
  }
}
