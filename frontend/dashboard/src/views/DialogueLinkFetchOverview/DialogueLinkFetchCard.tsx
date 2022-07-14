import * as UI from '@haas/ui';
import {
  useClipboard,
} from '@chakra-ui/core';
import { useToast } from 'hooks/useToast';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components';

import { PublicDialogueInfo } from 'types/generated-types';

import { stripPrefixFromUrl } from './DialogueLinkFetchCard.helpers';

interface DialogueCardContainerProps {
  loading: boolean;
}

const DialogueCardContainer = styled(UI.Div)<DialogueCardContainerProps>`
  ${({ theme, loading }) => css`
    background: white;
    box-shadow: ${theme.boxShadows.md};
    border-radius: ${theme.borderRadiuses.md}px;
    transition: all ${theme.transitions.normal};

    ${loading && css`
      opacity: 0.6;
      pointer-events: none;
      transition: all ${theme.transitions.normal};
    `}

    &:hover {
      box-shadow: ${theme.boxShadows.lg};
      cursor: pointer;
      transition: all ${theme.transitions.normal};
    }
  `}
`;

interface DialogueCardProps {
  dialogue: PublicDialogueInfo;
  loading: boolean;
}

const DialogueCard = ({ dialogue, loading }: DialogueCardProps) => {
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(dialogue.url);
  const { t } = useTranslation();

  const handleCardClick = () => {
    onCopy?.();
    toast.success({ title: 'Dialogue url copied', description: 'Copied the url of the selected dialogue' });
  };

  const urlBase = stripPrefixFromUrl(dialogue.url);

  return (
    <DialogueCardContainer
      data-cy="DialogueCard"
      bg="white"
      loading={loading}
      onClick={() => handleCardClick()}
    >
      <UI.CardBody height="100%">
        <UI.ColumnFlex justifyContent="space-between" height="100%">
          <UI.Div>
            <UI.H4 color="off.600" fontWeight="700">
              {dialogue.title}
            </UI.H4>
            <UI.ExtLink to={dialogue.url} color="off.300">
              {urlBase}
            </UI.ExtLink>
          </UI.Div>

          <UI.Div>
            <UI.Button size="sm" variant="outline">
              {hasCopied ? t('copied') : t('copy_link')}
            </UI.Button>
          </UI.Div>
        </UI.ColumnFlex>
      </UI.CardBody>
    </DialogueCardContainer>
  );
};

export default DialogueCard;
