import * as UI from '@haas/ui';
import { FastForward, Repeat } from 'react-feather';
import React from 'react';

import * as Modal from 'components/Common/Modal';
import { useTranslation } from 'react-i18next';

interface IllegalBackModalProps {
  open: boolean;
  onRestart: () => void;
  onRedo: () => void;
}

export const IllegalBackModal = ({ open, onRestart, onRedo }: IllegalBackModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal.Root open={open} onClose={() => {}}>
      <UI.ModalBody style={{ minHeight: 'inherit' }}>
        <UI.H2 color="main.500" textAlign="left">
          {t('illegal_back_title')}
        </UI.H2>
        <UI.Paragraph textAlign="left" color="off.600" style={{ maxWidth: 600, whiteSpace: 'pre-wrap' }}>
          {t('illegal_back_description')}
        </UI.Paragraph>

        <UI.Div mt={4}>
          <UI.Flex flexWrap="wrap">
            <UI.Button
              leftIcon={() => <FastForward />}
              variantColor="main"
              mr={4}
              mb={[2, 2, 0]}
              onClick={onRedo}
            >
              {t('illegal_back_go_back')}
            </UI.Button>
            <UI.Button
              leftIcon={() => <Repeat />}
              variantColor="off"
              onClick={onRestart}
            >
              {t('illegal_back_restart')}
            </UI.Button>
          </UI.Flex>
        </UI.Div>
      </UI.ModalBody>
    </Modal.Root>
  );
};
