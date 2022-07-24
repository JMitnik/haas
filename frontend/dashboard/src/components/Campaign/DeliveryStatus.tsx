import * as UI from '@haas/ui';
import { Clock } from 'react-feather';
import { format } from 'date-fns';
import React from 'react';

import { DeepPartial } from 'types/customTypes';
import { DeliveryStatusEnum, DeliveryType } from 'types/generated-types';

const DeliveryScheduledLabel = ({ scheduledAt }: { scheduledAt: string }) => {
  const date = new Date(parseInt(scheduledAt, 10));

  return (
    <UI.Flex alignItems="center">
      <UI.Icon pr={1}>
        <Clock width="0.7rem" />
      </UI.Icon>
      {format(date, 'MM/dd HH:mm')}
    </UI.Flex>
  );
};

interface DeliveryStatusProps {
  delivery: DeepPartial<DeliveryType>;
  onlyStatus?: boolean;
}

export const DeliveryStatus = ({ delivery, onlyStatus = false }: DeliveryStatusProps) => {
  const status = delivery.currentStatus;

  switch (status) {
    case DeliveryStatusEnum.Finished: {
      return (
        <UI.Label variantColor="green">
          {status}
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Deployed: {
      return (
        <UI.Label variantColor="blue">
          {status}
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Scheduled: {
      return (
        <UI.Label>
          <UI.Div py={1}>
            <UI.Stack>
              <>
                <UI.Span>
                  {status}
                </UI.Span>
                {!onlyStatus && (
                <UI.Span fontSize="0.6rem">
                  {!!delivery.scheduledAt && (
                  // @ts-ignore
                  <DeliveryScheduledLabel scheduledAt={delivery.scheduledAt} />
                  )}
                </UI.Span>
                )}
              </>
            </UI.Stack>
          </UI.Div>
        </UI.Label>
      );
    }

    case DeliveryStatusEnum.Opened: {
      return (
        <UI.Label variantColor="yellow">{status}</UI.Label>
      );
    }

    case DeliveryStatusEnum.Failed: {
      return (
        <UI.Label variantColor="red">{status}</UI.Label>
      );
    }

    case DeliveryStatusEnum.Delivered: {
      return (
        <UI.Label variantColor="cyan">{status}</UI.Label>
      );
    }
    default: {
      return (
        <UI.Label variantColor="blue">{status}</UI.Label>
      );
    }
  }
};
