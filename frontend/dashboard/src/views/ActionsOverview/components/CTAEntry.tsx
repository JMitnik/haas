import { ApolloError } from 'apollo-boost';
import { Edit3, X } from 'react-feather';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React from 'react';
import styled, { css } from 'styled-components/macro';

import { Flex, Span } from '@haas/ui';
import deleteCTAMutation from 'mutations/deleteCTA';
import getCTANodesQuery from 'queries/getCTANodes';

import CTAForm from './CTAForm';
import CTAIcon from './CTAIcon';
import DeleteCTAButton from './DeleteCTAButton';
import EditCTAButton from './EditCTAButton';

interface CTAEntryProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  Icon: (props: any) => JSX.Element;
  activeCTA: string | null;
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
}

const CTAEntryContainer = styled(Flex) <{ activeCTA: string | null, id: string }>`
 ${({ id, activeCTA, theme }) => css`
    position: relative;
    flex-direction: column;
    color: ${theme.colors.default.muted};

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

    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    padding-left: 30px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
 `}
`;

const OverflowSpan = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
  `}
  font-size: 1.2em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CTAEntry = ({ id, activeCTA, onActiveCTAChange, title, type, Icon }: CTAEntryProps) => {
  const { customerSlug, dialogueSlug } = useParams();

  const [deleteEntry] = useMutation(deleteCTAMutation, {
    variables: {
      id,
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [{
      query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }],
  });

  return (
    <CTAEntryContainer id={id} activeCTA={activeCTA}>
      <DeleteCTAButton disabled={(!!activeCTA && activeCTA !== id) || false} onClick={() => deleteEntry()}>
        <X />
      </DeleteCTAButton>

      <Flex flexDirection="row" width="100%">
        <CTAIcon type={type} Icon={Icon} />

        <Flex width="60%" flexDirection="column">
          <Span fontSize="1.4em">
            Title
          </Span>
          <OverflowSpan>
            {title}
          </OverflowSpan>
        </Flex>

        <Flex width="30%" alignItems="center" justifyContent="center">
          <EditCTAButton disabled={(activeCTA && activeCTA !== id) || false} onClick={() => onActiveCTAChange(id)}>
            <Edit3 />
            <Span>
              Edit
            </Span>
          </EditCTAButton>
        </Flex>

      </Flex>

      {activeCTA === id
          && (
            <CTAForm id={id} title={title} type={type} onActiveCTAChange={onActiveCTAChange} />
          )}

    </CTAEntryContainer>
  );
};

export default CTAEntry;
