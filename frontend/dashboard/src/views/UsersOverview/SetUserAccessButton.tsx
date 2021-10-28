import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useDisclosure } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Popover from 'components/Common/Popover';
import * as Table from 'components/Common/Table';
import useAuth from 'hooks/useAuth';

interface SetAccessUserButtonProps {
  children?: (onClose: () => void) => React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  arrowBg?: string;
  isActive: boolean;
}

const SetUserAccessButton = ({ children, isActive, label, icon, arrowBg = 'white' }: SetAccessUserButtonProps) => {
  const { canInviteUsers } = useAuth();
  const { t } = useTranslation();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover.Base
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Popover.Trigger>
        <Table.InnerCell brand={isActive ? 'green' : 'red'}>
          <UI.Helper color={isActive ? 'green.600' : 'red.600'}>
            {isActive ? 'Active' : 'Inactive'}
          </UI.Helper>
        </Table.InnerCell>
      </Popover.Trigger>
      <Popover.Body hasClose arrowBg={arrowBg} hasArrow padding={0} maxWidth={700}>
        {children?.(onClose)}
      </Popover.Body>
    </Popover.Base>
  );
};

export default SetUserAccessButton;
