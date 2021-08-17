import { UserInputError } from 'apollo-server';
import { inputObjectType, mutationField, objectType } from '@nexus/schema';

import { parseCsv } from '../../../utils/parseCsv';

export const CreateBatchDeliveriesInputType = inputObjectType({
  name: 'CreateBatchDeliveriesInputType',
  definition(t) {
    t.id('campaignId');
    t.string('workspaceId');
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

export const CreateBatchDeliveriesResolver = mutationField('createBatchDeliveries', {
  type: CreateBatchDeliveriesOutputType,
  args: { input: CreateBatchDeliveriesInputType },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('Empty input!');
    if (!args.input.uploadedCsv) throw new UserInputError('No CSV uploaded!');
    if (!args.input.campaignId) throw new UserInputError('No related campaign provided!');
    if (!args.input.batchScheduledAt) throw new UserInputError('No scheduled date provided!');

    const callbackUrl = `${ctx.session?.baseUrl}/webhooks/delivery`;
    const records = await parseCsv(await args.input.uploadedCsv);

    return await ctx.services.campaignService.createBatchDeliveries(
      args.input.campaignId,
      records,
      args.input.batchScheduledAt,
      callbackUrl
    );
  },
});
