import * as UI from '@haas/ui';
import React, { useState } from 'react';

import * as Tooltip from 'components/Common/Tooltip/Tooltip';
import { Avatar } from 'components/Common/Avatar';
import { UserType } from 'types/generated-types';

interface AssigneeAvatarProps {
  assignee: UserType;
  index: number;
}

export const AssigneeAvatar = ({ assignee, index }: AssigneeAvatarProps) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  return (
    <Tooltip.Root
      delayDuration={300}
      open={openTooltip}
      onOpenChange={setOpenTooltip}
    >
      <Tooltip.Trigger asChild>
        <UI.Div style={{ transform: `translateX(${index * 8}px)` }}>
          <Avatar hasHover brand="off" name={`${assignee?.firstName}`} />
        </UI.Div>
      </Tooltip.Trigger>
      <Tooltip.Content isOpen={openTooltip}>
        <UI.Div position="relative">
          <UI.Card padding={1} backgroundColor="white">
            <UI.Span color="off.600">
              {assignee?.firstName}
              {' '}
              {assignee?.lastName}
            </UI.Span>
          </UI.Card>
        </UI.Div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
