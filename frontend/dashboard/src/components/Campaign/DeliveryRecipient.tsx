import * as UI from '@haas/ui';
import React from 'react';

import { Avatar } from 'components/Common/Avatar';
import { DeliveryFragmentFragment } from 'types/generated-types';

export const DeliveryRecipient = ({ delivery }: { delivery: DeliveryFragmentFragment }) => (
  <UI.Flex alignItems="center">
    <UI.Div mr={2}>
      {delivery.deliveryRecipientFirstName && (
        <Avatar name={delivery.deliveryRecipientFirstName} brand="blue" />
      )}
    </UI.Div>
    <UI.ColumnFlex>
      <UI.Span fontWeight={600} color="blue.500">
        {delivery.deliveryRecipientFirstName}
        {' '}
        {delivery.deliveryRecipientLastName}
      </UI.Span>
      <UI.Span color="blue.300" fontSize="0.7rem">
        {delivery.id}
      </UI.Span>
    </UI.ColumnFlex>
  </UI.Flex>
);
