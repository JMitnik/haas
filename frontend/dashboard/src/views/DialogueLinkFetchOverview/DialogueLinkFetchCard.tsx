import * as UI from '@haas/ui';
import {
  useClipboard, useToast,
} from '@chakra-ui/core';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';
import styled from 'styled-components';

const DialogueCard = ({ dialogue, isCompact }: { dialogue: any, isCompact?: boolean }) => {
  const history = useHistory();
  const ref = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(dialogue.url);

  const handleCardClick = () => {
    onCopy?.();
    toast({
      title: 'Dialogue url copied',
      description: 'Copied the url of the selected dialogue',
      status: 'success',
      position: 'bottom-right',
      duration: 3000,
    });
  };

  return (
    <UI.Card
      // useOverlay
      ref={ref}
      data-cy="DialogueCard"
      bg="white"
      useFlex
      flexDirection="column"
      onClick={() => handleCardClick()}
    >
      {/* <UI.CardOverlay className="overlay" /> */}
      <UI.CardBody flex="100%">
        <UI.ColumnFlex justifyContent="space-between" height="100%">
          <UI.Div>
            <UI.Flex justifyContent="space-between" alignItems="center">
              <UI.Text fontSize={isCompact ? '1.1rem' : '1.4rem'} color="app.onWhite" mb={2} fontWeight={500}>
                {dialogue.title}
              </UI.Text>
            </UI.Flex>
            <UI.Paragraph fontSize="0.8rem" color="app.mutedOnWhite" fontWeight="100">
              <UI.ExtLink to={dialogue.url}>
                {dialogue.url}
              </UI.ExtLink>
            </UI.Paragraph>
          </UI.Div>
        </UI.ColumnFlex>
      </UI.CardBody>
    </UI.Card>
  );
};

export default DialogueCard;
