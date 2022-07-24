import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import * as Popover from 'components/Common/Popover';
import useAuth from 'hooks/useAuth';

interface InviteButtonProps {
  children?: (onClose: () => void) => React.ReactNode;
}

const InviteUserButton = ({ children }: InviteButtonProps) => {
  const { canInviteUsers } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Popover.Trigger asChild>
        <UI.Button
          isDisabled={!canInviteUsers}
          size="sm"
          ml={4}
          leftIcon={() => <Plus />}
        >
          {t('invite_user')}
        </UI.Button>
      </Popover.Trigger>
      <Popover.Content isOpen={isOpen}>
        <UI.Card>
          <UI.CardBody>
            {children?.(handleClose)}
          </UI.CardBody>
        </UI.Card>
      </Popover.Content>
    </Popover.Root>
  );
};

export default InviteUserButton;
