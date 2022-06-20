import * as UI from '@haas/ui';
import { MoreVertical } from 'react-feather';
import { RectReadOnly } from 'react-use-measure';
import React, { useState } from 'react';

import * as Popover from 'components/Common/Popover';

interface ShowMoreButtonProps {
  children?: (onClose: () => void) => React.ReactNode;
  bounds: RectReadOnly;
  index: number;
  margin: number;
}

/**
 * PickerButton that triggers a Popover.
 */
export const ShowMoreButton = ({ children, bounds, index, margin }: ShowMoreButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Popover.Trigger asChild>
        <MoreVertical
          color="grey"
          x={bounds.width - 15}
          y={index * (16 + margin + 13.5)}
        />
      </Popover.Trigger>
      <Popover.Content isOpen={isOpen}>
        <UI.Card maxWidth={700}>
          {children?.(handleClose)}
        </UI.Card>
      </Popover.Content>
    </Popover.Root>
  );
};
