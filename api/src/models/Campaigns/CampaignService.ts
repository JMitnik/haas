import { addDays } from 'date-fns';
import { uniqueId } from 'lodash';
import { PrismaClient } from '@prisma/client';
import AWS from '../../config/aws';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { DeliveryStatusTypeEnum, FindManyDeliveryArgs } from '@prisma/client';

interface DeliveryOptionsProps {
  status?: DeliveryStatusTypeEnum;
  variantId?: string;
}

export interface DeliveryUpdateItemProps {
  dateId: string;
  oldStatus: DeliveryStatusTypeEnum;
  newStatus: DeliveryStatusTypeEnum;
}

export class CampaignService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }


  /**
   * Gets paginated deliveries given a `campaignId`, generic `paginationOptions` and specific
   * delivery-centric access options.
   * @param campaignId
   * @param paginationOptions
   */
  async getPaginatedDeliveries<GenericModelType>(
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
      },
    };

    const findManyDeliveriesCallback = ({ props: findManyArgs }: FindManyCallBackProps) => (
      this.prisma.delivery.findMany({
        ...findManyArgs,
        include: {
          events: true
        }
      })
    );
    const countDeliveriesCallback = async ({ props: countArgs }: FindManyCallBackProps) => (
      this.prisma.delivery.count(countArgs)
    );

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
  getStatisticsFromDeliveries(deliveries: NexusGenFieldTypes['DeliveryType'][]) {
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
  async updateBatchDeliveries(updatedDeliveries: DeliveryUpdateItemProps[]) {
    const deliveryUpdates = updatedDeliveries.map(delivery => {
      const id = delivery.dateId.slice(delivery.dateId.length - 10);

      const updateDelivery = this.prisma.delivery.update({
        where: { id },
        data: {
          currentStatus: delivery.newStatus,
        }
      });

      const newEvent = this.prisma.deliveryEvents.create({
        data: {
          status: delivery.newStatus,
          Delivery: { connect: { id } }
        }
      });

      return [updateDelivery, newEvent];
    });

    const deliveries = deliveryUpdates.flat();

    // @ts-ignore
    return await this.prisma.$transaction(deliveries);
  }
}
