import { AlertCircle, Clock, Eye, Flag, HelpCircle, Icon, Mail, UserCheck } from 'react-feather';
import React from 'react';

import { DeliveryStatusEnum } from 'types/generated-types';

const MapCampaignIcon: { [key in DeliveryStatusEnum]?: Icon } = {
  [DeliveryStatusEnum.Deployed]: Mail,
  [DeliveryStatusEnum.Failed]: AlertCircle,
  [DeliveryStatusEnum.Finished]: Flag,
  [DeliveryStatusEnum.Opened]: Eye,
  [DeliveryStatusEnum.Scheduled]: Clock,
  [DeliveryStatusEnum.Sent]: Mail,
  [DeliveryStatusEnum.Delivered]: UserCheck,
};

export const CampaignIcon = ({ deliveryType }: { deliveryType: DeliveryStatusEnum }) => {
  const MappedCampaignIcon = MapCampaignIcon[deliveryType];

  if (!MappedCampaignIcon) {
    return <HelpCircle />;
  }

  return <MappedCampaignIcon />;
};
