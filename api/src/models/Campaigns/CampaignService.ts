import { addDays } from 'date-fns';
import { uniqueId } from 'lodash';
import prisma from '../../config/prisma';
import AWS from '../../config/aws';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { DeliveryStatusTypeEnum, FindManyDeliveryArgs } from '@prisma/client';

interface DeliveryOptionsProps {
  status?: DeliveryStatusTypeEnum;
  variantId?: string;
}

interface DeliveryUpdateItemProps {
  dateId: string;
  oldStatus: DeliveryStatusTypeEnum;
  newStatus: DeliveryStatusTypeEnum;
}

export class CampaignService {
  /**
   * Gets paginated deliveries given a `campaignId`, generic `paginationOptions` and specific
   * delivery-centric access options.
   * @param campaignId 
   * @param paginationOptions 
   */
  static getPaginatedDeliveries<GenericModelType>(
    campaignId: string,
    paginationOptions?: NexusGenInputs['PaginationWhereInput'],
    deliveryOptions?: DeliveryOptionsProps
  ) {
    const deliveryFilterOptions: FindManyDeliveryArgs = { 
      where: { 
        campaignId,
        currentStatus: deliveryOptions?.status || undefined,
        campaignVariant: (!!deliveryOptions || undefined) && {
          id: deliveryOptions?.variantId
        },
        scheduledAt: {
          
        }
      } 
    };
    
    const findManyDeliveriesCallback = ({ props: findManyArgs }: FindManyCallBackProps) => prisma.delivery.findMany(findManyArgs);
    const countDeliveriesCallback = async ({ props: countArgs } : FindManyCallBackProps) => prisma.delivery.count(countArgs);

    const deliveryPaginationOptions: PaginateProps = {
      findManyArgs: {
        findArgs: deliveryFilterOptions,
        findManyCallBack: findManyDeliveriesCallback,
        searchFields: [],
        orderFields: [],
      },
      countArgs: {
        countCallBack: countDeliveriesCallback,
        countWhereInput: deliveryFilterOptions
      },
      paginationOpts: paginationOptions
    };

    return paginate<GenericModelType>(deliveryPaginationOptions);
  }

  /**
   * Fetches general statistics about a specific collection
   * @param deliveries 
   */
  static getStatisticsFromDeliveries(
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
   * Update a batch of deliveries
   */
  static async updateBatchDeliveries(updatedDeliveries: DeliveryUpdateItemProps[]) {

    const deliveryUpdates = updatedDeliveries.map(delivery => {
      const id = delivery.dateId.slice(delivery.dateId.length - 10);

      return prisma.delivery.update({
        where: { id },
        data: {
          currentStatus: delivery.newStatus,
        }
      })
    });

    return await prisma.$transaction(deliveryUpdates);
  }
}
