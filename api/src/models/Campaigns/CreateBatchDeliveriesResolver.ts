import { UserInputError } from 'apollo-server';
import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { nanoid } from 'nanoid';
import format from 'date-fns/format';
import mustache from 'mustache';

import { CampaignVariantTypeEnum, DeliveryStatusTypeEnum } from '@prisma/client';
import { parseCsv } from '../../utils/parseCsv';
import { probability } from '../../utils/probability';
import prisma from '../../config/prisma';
import DynamoScheduleService from '../../services/DynamoScheduleService';

interface CSVDeliveryRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export const CreateBatchDeliveriesInputType = inputObjectType({
  name: 'CreateBatchDeliveriesInputType',
  definition(t) {
    t.id('campaignId');
    t.upload('uploadedCsv');
    t.string('batchScheduledAt');
  },
});

export const FailedDeliveryModel = objectType({
  name: 'FailedDeliveryModel',
  definition(t) {
    t.string('record');
    t.string('error');
  },
});

export const CreateBatchDeliveriesOutputType = objectType({
  name: 'CreateBatchDeliveriesOutputType',
  definition(t) {
    t.list.field('failedDeliveries', { type: FailedDeliveryModel });
    t.int('nrDeliveries');
  },
});

interface ErroredRecord {
  record: any;
  error: string;
}

interface ValidateDeliveryRecordsResults {
  erroredRecords: ErroredRecord[];
  successRecords: CSVDeliveryRow[];
}

/**
 * Validates uploaded CSV based on the following rules:
 * - If only EMAIL campaigns exist, require a record to have `phone`
 * - If only SMS campaigns exist, require a record to have `email`
 * @param csvRecords
 * @param campaignVariants
 */
export const validateDeliveryRows = (
  csvRecords: any[],
  campaignVariants: CampaignVariantTypeEnum[],
): ValidateDeliveryRecordsResults => {
  const requiresEmail = campaignVariants.filter((variant) => variant === 'EMAIL').length === campaignVariants.length;
  const requiresPhone = campaignVariants.filter((variant) => variant === 'SMS').length === campaignVariants.length;

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

    console.log('Success!');
    successRecords.push({
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      phoneNumber: record.phone,
    });
  });

  return {
    erroredRecords,
    successRecords,
  };
};

export const CreateBatchDeliveriesResolver = mutationField('createBatchDeliveries', {
  type: CreateBatchDeliveriesOutputType,
  args: { input: CreateBatchDeliveriesInputType },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');
    if (!args.input.uploadedCsv) throw new UserInputError('No CSV uploaded!');

    const file = await args.input.uploadedCsv;
    const csvData = await parseCsv(file);

    if (!args.input.campaignId) throw new UserInputError('No related campaign provided!');
    if (!args.input.batchScheduledAt) throw new UserInputError('No scheduled date provided!');

    const relatedCampaign = await prisma.campaign.findOne({
      where: { id: args.input.campaignId },
      include: {
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true,
              }
            },
          },
        },
      },
    });

    if (!relatedCampaign) throw new UserInputError('Related campaign does not exist');

    // Validate CSV
    const { successRecords, erroredRecords } = validateDeliveryRows(
      csvData,
      relatedCampaign.variantsEdges.map((variantEdge) => variantEdge.campaignVariant.type),
    );

    // For each row in CSV, we do some small preprocessing
    const preprocessedRecords = successRecords.map(record => {
      // Generate unique ID
      const id = nanoid(10);

      // Derive the scheduleKey (dayMonthYear) and scheduleKeyId (timestamp_uniqueId)
      const scheduledDate = new Date(args.input?.batchScheduledAt as string);
      const scheduleKey = format(scheduledDate, 'ddMMyyyy');
      const scheduleKeyId = `${scheduledDate.toISOString()}_${id}`;

      // Assign a campaign variant
      const useFirstVariant = probability(relatedCampaign.variantsEdges[0].weight);
      const variant = useFirstVariant ? relatedCampaign.variantsEdges[0] : relatedCampaign.variantsEdges[1];

      const dialogueUrl = `https://haas.live/${id}`;

      // Derive body of variant based on present data
      const templateBody = variant.campaignVariant.body.replace(/\{\{([^\}]*)\}\}/g, '{{{$1}}}');

      const body = mustache.render(templateBody, {
        firstName: record.firstName,
        lastName: record.lastName,
        dialogueUrl,
        dialogueName: variant?.campaignVariant?.dialogue?.title || '',
        workspaceName: variant?.campaignVariant?.workspace?.name || '',
      });

      return {
        ...record,
        id,
        scheduleKey,
        variant,
        body,
        scheduleKeyId
      }
    });

    const successes = await Promise.all(preprocessedRecords.map(async (record) => {
      const now = new Date().toISOString();

      try {
        const delivery = await prisma.delivery.create({
          data: {
            id: record.id,
            deliveryRecipientEmail: record.email,
            deliveryRecipientLastName: record.lastName,
            deliveryRecipientFirstName: record.firstName,
            deliveryRecipientPhone: record.phoneNumber,
            campaignVariant: {
              connect: { id: record.variant.campaignVariantId },
            },
            campaign: {
              connect: { id: record.variant.campaignId },
            },
            currentStatus: 'SCHEDULED',
            // TODO: catch this on creation
            scheduledAt: new Date(args?.input?.batchScheduledAt as string) || now,
          },
        });

        await prisma.deliveryEvents.create({
          data: {
            status: 'SCHEDULED',
            Delivery: { connect: { id: delivery.id } },
            createdAt: delivery.createdAt
          }
        });

        return true;
      } catch (e) {
        console.log('Error:', e);
        return false;
      }
    }));

    const callbackUrl = `${ctx.session?.tunnelUrl}/webhooks/delivery`;

    try {
      await DynamoScheduleService.batchScheduleOneOffs(preprocessedRecords.map(record => ({
        attributes: [
          {
            key: 'DeliveryDate',
            value: record.scheduleKey,
            type: 'string'
          },
          {
            key: 'DeliveryDate_DeliveryID',
            value: record.scheduleKeyId,
            type: 'string'
          },
          {
            key: 'DeliveryRecipient',
            type: 'string',
            value: (record.variant.campaignVariant.type === 'EMAIL' ? record.email : record.phoneNumber) || ''
          },
          {
            key: 'DeliveryBody',
            type: 'string',
            value: record.body
          },
          {
            key: 'DeliveryStatus',
            type: 'string',
            value: DeliveryStatusTypeEnum.SCHEDULED
          },
          {
            key: 'DeliveryType',
            type: 'string',
            value: record.variant.campaignVariant.type
          },
          {
            key: 'callback',
            type: 'string',
            value: callbackUrl
          },
          {
            key: 'phoneNumber',
            type: 'string',
            value: record.phoneNumber || ''
          },
        ]
      })), { tableName: 'CampaignDeliveries' });
    } catch (e) {
      console.log(e);
    }

    return {
      nrDeliveries: successes.filter((item) => item).length,
      failedDeliveries: erroredRecords,
    } as any;
  },
});
