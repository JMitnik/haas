import { UserInputError } from 'apollo-server';
import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { nanoid } from 'nanoid';

import { CampaignVariantTypeEnum } from '@prisma/client';
import { parseCsv } from '../../utils/parseCsv';
import { probability } from '../../utils/probability';
import prisma from '../../config/prisma';

interface CSVDeliveryRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export const CreateBatchDeliveriesInputType = inputObjectType({
  name: 'CreateBatchDeliveriesInputType',
  definition(t) {
    t.string('label');
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

  async resolve(parent, args) {
    if (!args.input) throw new UserInputError('Empty input!');
    if (!args.input.uploadedCsv) throw new UserInputError('No CSV uploaded!');

    const file = await args.input.uploadedCsv;
    const csvData = await parseCsv(file);

    if (!args.input.campaignId) throw new UserInputError('No related campaign provided!');
    const relatedCampaign = await prisma.campaign.findOne({
      where: { id: args.input.campaignId },
      include: {
        variantsEdges: {
          include: {
            campaignVariant: true,
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

    // 3. For each row in CSV, assign a delivery to a potential "Variant" based on weight
    const successes = await Promise.all(successRecords.map(async (record) => {
      const useFirstVariant = probability(relatedCampaign.variantsEdges[0].weight);
      const variant = useFirstVariant ? relatedCampaign.variantsEdges[0] : relatedCampaign.variantsEdges[1];
      const id = nanoid(10);

      const now = new Date().toISOString();

      try {
        await prisma.delivery.create({
          data: {
            id,
            deliveryRecipientEmail: record.email,
            deliveryRecipientLastName: record.lastName,
            deliveryRecipientFirstName: record.firstName,
            deliveryRecipientPhone: record.phoneNumber,
            campaignVariant: {
              connect: { id: variant.campaignVariantId },
            },
            campaign: {
              connect: { id: variant.campaignId },
            },
            currentStatus: 'SCHEDULED',
            scheduledAt: args?.input?.batchScheduledAt || now,
          },
        });
        return true;
      } catch (e) {
        console.log('Error:', e);
        return false;
      }
    }));

    return {
      nrDeliveries: successes.filter((item) => item).length,
      failedDeliveries: erroredRecords,
    } as any;
  },
});
