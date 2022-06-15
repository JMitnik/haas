import * as Ani from 'components/animation';
import * as UI from '@haas/ui';
import { Edit3 } from 'react-feather';
import { motion } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components';

import { Flex, Span } from '@haas/ui';
import { useCustomer } from 'providers/CustomerProvider';
import deleteCTAMutation from 'mutations/deleteCTA';
import getCTANodesQuery from 'queries/getCTANodes';

import CTAForm from './CTAForm';
import CTAIcon from './CTAIcon';

interface LinkInputProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  url: string;
  icon?: string;
  backgroundColor?: string;
}

interface ShareProps {
  id?: string;
  title: string;
  url: string;
  tooltip: string;
}
interface CTACardProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  links: Array<LinkInputProps>;
  share: ShareProps | null;
  Icon: (props: any) => JSX.Element;
  activeCTA: string | null;
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange: React.Dispatch<React.SetStateAction<boolean>>;
  form?: any;
}

const CTACardContainer = styled(UI.Card) <{ activeCTA: string | null, id: string }>`
 ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: column;
    color: ${theme.colors.default.muted};
    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    padding-left: 30px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};

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
    /* white-space: nowrap; */
    text-overflow: ellipsis;
  `}
`;

const CTACard = (
  { id, activeCTA, onActiveCTAChange, title, type, links, share, Icon, onNewCTAChange, form: formNode }: CTACardProps,
) => {
  const toast = useToast();
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const [deleteEntry] = useMutation(deleteCTAMutation, {
    variables: {
      input: {
        customerId: activeCustomer?.id,
        dialogueSlug,
        id,
      },
    },
    onCompleted: () => {
      toast({
        title: 'CTA deleted!',
        description: 'The call to action has been deleted.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem in deleting the call to action.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
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
    <Ani.FadeFromTop>
      <CTACardContainer noHover id={id} activeCTA={activeCTA}>
        <Flex justifyContent="space-between" flexDirection="row" width="100%">
          <UI.Flex>
            <CTAIcon type={type} Icon={Icon} />

            <Flex flexDirection="column">
              <motion.span>
                <UI.Text style={{ textTransform: 'uppercase' }} color="gray.400" fontWeight="500" fontSize="0.8rem">
                  {t('title')}
                </UI.Text>
              </motion.span>
              <OverflowSpan>
                <UI.Text fontWeight="600" color="gray.600">
                  <ReactMarkdown>
                    {title || t('none') || ''}
                  </ReactMarkdown>
                </UI.Text>
              </OverflowSpan>
            </Flex>
          </UI.Flex>

          <Flex alignItems="center" justifyContent="center">
            <UI.Button
              ml={4}
              mr={4}
              variant="outline"
              variantColor="teal"
              size="sm"
              leftIcon={Edit3}
              isDisabled={(activeCTA && activeCTA !== id) || false}
              onClick={() => onActiveCTAChange(id)}
            >
              <Span>
                {t('edit')}
              </Span>
            </UI.Button>
          </Flex>

        </Flex>

        {activeCTA === id && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CTAForm
              id={id}
              form={formNode}
              title={title}
              type={type}
              links={links}
              share={share}
              onDeleteCTA={deleteCTA}
              onActiveCTAChange={onActiveCTAChange}
              onNewCTAChange={onNewCTAChange}
            />
          </motion.div>
        )}

      </CTACardContainer>
    </Ani.FadeFromTop>
  );
};

export default CTACard;
