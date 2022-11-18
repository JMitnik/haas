import { Eye, HelpCircle } from 'react-feather';
import React from 'react';

import { AuditEventType } from 'types/generated-types';
import { ReactComponent as FormNodeIcon } from 'assets/icons/icon-survey.svg';
import { ReactComponent as MultiChoiceIcon } from 'assets/icons/multi-choice-icon.svg';
import { ReactComponent as SliderIcon } from 'assets/icons/haas.svg';
import LinkIcon from 'components/Icons/LinkIcon';

const FormIcon = () => (
  <>
    <FormNodeIcon style={{ margin: '0 auto', width: '70%' }} />
  </>
);

const MapAuditEventIcon: { [key in AuditEventType]?: any } = {
  [AuditEventType.ActionRequestConfirmedCompleted]: SliderIcon,
  [AuditEventType.ActionRequestRejectedCompleted]: MultiChoiceIcon,
  [AuditEventType.AssignActionRequest]: FormIcon,
  [AuditEventType.SendStaleActionRequestReminder]: Eye,
  [AuditEventType.SetActionRequestStatus]: LinkIcon,
};

export const AuditEventIcon = ({ nodeType }: { nodeType: AuditEventType }) => {
  const MappedCampaignIcon = MapAuditEventIcon[nodeType];

  if (!MappedCampaignIcon) {
    return <HelpCircle />;
  }

  return <MappedCampaignIcon />;
};
