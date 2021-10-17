import * as UI from '@haas/ui';
import { Circle } from 'components/Common/Circle';
import { Mail, Smartphone } from 'react-feather';
import React from 'react';

import { CampaignVariantEnum, DeliveryFragmentFragment } from 'types/generated-types';

export const DeliveryRecipientAddress = ({ delivery }: { delivery: DeliveryFragmentFragment }) => (
  <UI.Div>
    {delivery.campaignVariant?.type === CampaignVariantEnum.Email && (
      <UI.Stack isInline spacing={2}>
        <Circle brand="blue">
          <UI.Icon>
            <Mail />
          </UI.Icon>
        </Circle>
        <UI.Div>
          <UI.Span fontWeight={800} color="blue.800">
            {delivery.deliveryRecipientEmail}
          </UI.Span>
          <UI.Label bg="blue.600" color="blue.100" size="sm" fontSize="0.6rem">
            EMAIL
          </UI.Label>
        </UI.Div>
      </UI.Stack>
    )}
    {delivery.campaignVariant?.type === CampaignVariantEnum.Sms && (
      <UI.Stack isInline spacing={2}>
        <Circle brand="teal">
          <UI.Icon>
            <Smartphone />
          </UI.Icon>
        </Circle>
        <UI.Div>
          <UI.Span fontWeight={800} color="teal.800">
            {delivery.deliveryRecipientPhone}
          </UI.Span>
          <UI.Label bg="teal.600" color="teal.100" size="sm" fontSize="0.6rem">
            SMS
          </UI.Label>
        </UI.Div>
      </UI.Stack>
    )}
  </UI.Div>
);
