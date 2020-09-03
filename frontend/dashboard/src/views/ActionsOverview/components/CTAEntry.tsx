import { Edit3 } from 'react-feather';
import { motion } from 'framer-motion';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Flex, Span } from '@haas/ui';
import deleteCTAMutation from 'mutations/deleteCTA';
import getCTANodesQuery from 'queries/getCTANodes';

import CTAForm from './CTAForm';
import CTAIcon from './CTAIcon';
import EditCTAButton from './EditCTAButton';

interface LinkInputProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  url: string;
  icon?: string;
  backgroundColor?: string;
}
interface CTAEntryProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  links: Array<LinkInputProps>;
  Icon: (props: any) => JSX.Element;
  activeCTA: string | null;
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const CTAEntryContainer = styled(Flex)<{ activeCTA: string | null, id: string }>`
 ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: column;
    color: ${theme.colors.default.muted};
    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    padding-left: 30px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    ${!activeCTA && css`
      background-color: ${theme.colors.white};
    `};

    ${activeCTA === id && css`
      background-color: ${theme.colors.white};
    `};

    ${activeCTA && activeCTA !== id && css`
      background-color: ${theme.colors.white};
      opacity: 0.5;
    `};
 `}
`;

const OverflowSpan = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
    font-size: 1.2em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `}
`;

const CTAEntry = ({ id, activeCTA, onActiveCTAChange, title, type, links, Icon, onNewCTAChange }: CTAEntryProps) => {
  const toast = useToast();
  const { t } = useTranslation();

  const { customerSlug, dialogueSlug } = useParams();
  const [deleteEntry] = useMutation(deleteCTAMutation, {
    variables: { id },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem in deleting the call to action.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Edit complete!',
        description: 'The call to action has been deleted.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    refetchQueries: [{
      query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
        searchTerm: '',
      },
    }],
  });

  const deleteCTA = () => {
    if (id === '-1') {
      onNewCTAChange(false);
      return onActiveCTAChange(null);
    }
    onActiveCTAChange(null);
    return deleteEntry();
  };

  return (
    <motion.div initial={{ opacity: 1, y: 150 }} animate={{ opacity: 1, y: 0 }}>

      <CTAEntryContainer id={id} activeCTA={activeCTA}>

        <Flex flexDirection="row" width="100%">
          <CTAIcon type={type} Icon={Icon} />

          <Flex width="60%" flexDirection="column">
            <Span fontSize="1.4em">
              {t('title')}
            </Span>
            <OverflowSpan>
              {title || t('none')}
            </OverflowSpan>
          </Flex>

          <Flex width="30%" alignItems="center" justifyContent="center">
            <EditCTAButton disabled={(activeCTA && activeCTA !== id) || false} onClick={() => onActiveCTAChange(id)}>
              <Edit3 />
              <Span>
                {t('edit')}
              </Span>
            </EditCTAButton>
          </Flex>

        </Flex>

        {activeCTA === id
          && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CTAForm
                id={id}
                title={title}
                type={type}
                links={links}
                onDeleteCTA={deleteCTA}
                onActiveCTAChange={onActiveCTAChange}
                onNewCTAChange={onNewCTAChange}
              />
            </motion.div>

          )}

      </CTAEntryContainer>
    </motion.div>
  );
};

export default CTAEntry;
