
import React, { useState } from 'react';
import * as UI from '@haas/ui';
import { Filter } from 'react-feather';

import * as Dropdown from 'components/Common/Dropdown';
import * as Tooltip from 'components/Common/Tooltip';

interface FilterEnabledLabelProps {
  onResetFilter: () => void;
}

export const FilterEnabledLabel = ({ onResetFilter }: FilterEnabledLabelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setPopoverIsOpen] = useState(false);

  return (
    <Dropdown.Root open={isPopoverOpen} onOpenChange={setPopoverIsOpen}>
      <Tooltip.Root delayDuration={300} open={isOpen} onOpenChange={setIsOpen}>
        <Dropdown.Trigger>

          <Tooltip.Trigger>
            <UI.Button size="sm" variantColor="main" variant="solid">
              <UI.Icon>
                <Filter />
              </UI.Icon>
            </UI.Button>
          </Tooltip.Trigger>
        </Dropdown.Trigger>

        <Tooltip.Content isOpen={isOpen}>
          <UI.Card padding={1} backgroundColor="white" style={{ borderRadius: 10 }}>
            <UI.Span color="off.600">We are showing a filtered selection</UI.Span>
          </UI.Card>
        </Tooltip.Content>
      </Tooltip.Root>

      <Dropdown.Content open={isPopoverOpen}>
        <Dropdown.Item
          onClick={onResetFilter}
        >
          Reset filter
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
