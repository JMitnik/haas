import * as UI from '@haas/ui';
import React from 'react';

import * as Modal from 'components/Common/Modal';
import { useTranslation } from 'react-i18next';

interface ClosedDialogueModalProps {
  open: boolean;
}

export const ClosedDialogueModal = ({ open }: ClosedDialogueModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal.Root open={open} onClose={() => {}}>
      <UI.ModalBody style={{ minHeight: 'inherit' }}>
        <UI.H2 color="main.500" textAlign="left">
          {t('closed_title')}
        </UI.H2>
        <UI.Paragraph textAlign="left" color="off.600" style={{ maxWidth: 600, whiteSpace: 'pre-wrap' }}>
          {t('closed_description')}
        </UI.Paragraph>
      </UI.ModalBody>
    </Modal.Root>
  );
};
