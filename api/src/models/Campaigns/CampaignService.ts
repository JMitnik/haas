import { addDays } from 'date-fns';
import { uniqueId } from 'lodash';
import prisma from '../../config/prisma';
import AWS from '../../config/aws';
import { NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { DeliveryStatusTypeEnum, FindManyDeliveryArgs } from '@prisma/client';

interface DeliveryOptionsProps {
  status?: DeliveryStatusTypeEnum;
  variantId?: string;
}

export class CampaignService {
  /**
   * Gets paginated deliveries
   * @param campaignId 
   * @param paginationOptions 
   */
  static getPaginatedDeliveries(
    campaignId: string,
    paginationOptions: NexusGenInputs['PaginationWhereInput'],
    deliveryOptions?: DeliveryOptionsProps
  ) {

    const findManyDeliveriesArgs: FindManyDeliveryArgs = { 
      where: { 
        campaignId,
        currentStatus: deliveryOptions?.status || undefined,
        campaignVariant: (!!deliveryOptions || undefined) && {
          id: deliveryOptions?.variantId
        }
      } 
    };
    
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
      paginationOpts: paginationOptions
    };

    return paginate(deliveryPaginationOptions);
  }
}


