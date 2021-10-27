import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useDisclosure } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Popover from 'components/Common/Popover';
import useAuth from 'hooks/useAuth';

interface InviteButtonProps {
  children?: (onClose: () => void) => React.ReactNode;
  label: string;
  icon?: React.ReactNode;
  arrowBg?: string;
}

const InviteUserButton = ({ children, label, icon, arrowBg = 'white' }: InviteButtonProps) => {
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
        <UI.Button
          isDisabled={!canInviteUsers}
          size="sm"
          ml={4}
          // onClick={handleAddUser}
          leftIcon={Plus}
          variantColor="teal"
        >
          {t('invite_user')}
        </UI.Button>
      </Popover.Trigger>
      <Popover.Body hasClose arrowBg={arrowBg} hasArrow padding={0} maxWidth={700}>
        {children?.(onClose)}
      </Popover.Body>
    </Popover.Base>
  );
};

export default InviteUserButton;
