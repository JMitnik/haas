import { addDays } from 'date-fns';
import { uniqueId } from 'lodash';
import prisma from '../../config/prisma';
import AWS from '../../config/aws';
import { NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { FindManyDeliveryArgs } from '@prisma/client';

export class CampaignService {
  static getPaginatedDeliveries(
    campaignId: string,
    paginationOpts: NexusGenInputs['PaginationWhereInput'],
  ) {

    const findManyDeliveriesArgs: FindManyDeliveryArgs = { where: { campaignId } };
    const findManyDeliveries = ({ props: findManyArgs }: FindManyCallBackProps) => prisma.delivery.findMany(findManyArgs);
    const countDeliveries = async ({ props: countArgs } : FindManyCallBackProps) => prisma.delivery.count(countArgs);

    const deliveryPaginationOptions: PaginateProps = {
      findManyArgs: {
        findArgs: findManyDeliveriesArgs,
        findManyCallBack: findManyDeliveries,
        searchFields: [],
        orderFields: [],
      },
      countArgs: {
        countCallBack: countDeliveries,
        countWhereInput: findManyDeliveriesArgs
      },
      paginationOpts
    };

    return paginate(deliveryPaginationOptions);
  }
}


