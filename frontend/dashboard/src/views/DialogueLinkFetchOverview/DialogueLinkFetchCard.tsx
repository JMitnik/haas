import * as UI from '@haas/ui';
import {
  Button, Avatar as ChakraAvatar, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useClipboard, useToast,
} from '@chakra-ui/core';
import { formatDistance } from 'date-fns';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';

import { ReactComponent as DEFlag } from 'assets/icons/flags/flag-de.svg';
import { ReactComponent as GBFlag } from 'assets/icons/flags/flag-gb.svg';
import { ReactComponent as NLFlag } from 'assets/icons/flags/flag-nl.svg';

import { deleteDialogueMutation } from 'mutations/deleteDialogue';
import ShowMoreButton from 'components/ShowMoreButton';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getLocale from 'utils/getLocale';
import useAuth from 'hooks/useAuth';

import { useCustomer } from 'providers/CustomerProvider';
import { useSetDialoguePrivacyMutation } from 'types/generated-types';
import { useUser } from 'providers/UserProvider';

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
      duration: 1500,
    });
  };

  return (
    <UI.Card
      ref={ref}
      data-cy="DialogueCard"
      bg="white"
      useFlex
      flexDirection="column"
      onClick={() => handleCardClick()}
    >
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
