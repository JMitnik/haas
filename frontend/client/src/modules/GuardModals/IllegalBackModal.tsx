import * as UI from '@haas/ui';
import { FastForward, Repeat } from 'react-feather';
import React from 'react';

import * as Modal from 'components/Common/Modal';

interface IllegalBackModalProps {
  open: boolean;
  onRestart: () => void;
}

export const IllegalBackModal = ({ open, onRestart }: IllegalBackModalProps) => (
  <Modal.Root open={open} onClose={() => {}}>
    <UI.ModalBody style={{ minHeight: 'inherit' }}>
      <UI.H2 color="main.500" textAlign="left">
        Want to retry?
      </UI.H2>
      <UI.Paragraph textAlign="left" color="off.600" style={{ maxWidth: 600 }}>
        It seems you tried to go back after our last question.
        <br />
        We want to ensure that you do not doubly fill in your last answers.
      </UI.Paragraph>

      <UI.Div mt={4}>
        <UI.Flex flexWrap="wrap">
          <UI.Button
            leftIcon={FastForward}
            variantColor="main"
            mr={4}
            mb={[2, 2, 0]}
          >
            Back to the last question
          </UI.Button>
          <UI.Button
            leftIcon={Repeat}
            variantColor="off"
            onClick={onRestart}
          >
            I want to start over
          </UI.Button>
        </UI.Flex>
      </UI.Div>
    </UI.ModalBody>
  </Modal.Root>
);
