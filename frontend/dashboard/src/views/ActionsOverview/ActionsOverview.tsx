import { Edit3, Plus } from 'react-feather';
import { useParams } from 'react-router-dom';
import React from 'react';

import { Button, Div, Flex, H2, Loader, Span } from '@haas/ui';
import { useQuery } from '@apollo/react-hooks';
import SearchBar from 'components/SearchBar/SearchBar';
import getCTANodesQuery from 'queries/getCTANodes';
import styled, { css } from 'styled-components/macro';

interface ActionOverviewProps {
  leafs: Array<any>;
}

interface CTAEntryProps {
  title: string;
  type: string;
}

const DialogueViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;

const AddCTAButton = styled(Button)`
   ${({ theme }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.default.dark};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    border: 0px;
    min-width: 80px;
    display: flex;
    margin-left: 20px;
    svg {
        margin-right: 2px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const EditCTAButton = styled(Button)`
    ${({ theme }) => css`
    padding: 4px 0px;
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnWhite} 1px solid;
    border-radius: ${theme.borderRadiuses.subtleRounded};
    font-size: 0.8em;
    color: ${theme.colors.default.darkest};
    min-width: 80px;
    display: flex;
    svg {
        margin-right: 10px;
        color: ${theme.colors.default.darkest};
        width: 10px;
        height: 10px;
    }
  `}
`;

const CTAEntryContainer = styled(Flex)`
 ${({ theme }) => css`
    color: ${theme.colors.app.mutedOnWhite};
    background-color: ${theme.colors.white};
    border: ${theme.colors.app.mutedOnDefault} 1px solid;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
 `}

`;

const OverflowSpan = styled(Span)`
  ${({ theme }) => css`
    color: ${theme.colors.default.darkest};
  `}
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CTAEntry = ({ title, type }: CTAEntryProps) => (
  <CTAEntryContainer alignItems="center" flexDirection="row">
    <Flex width="10%" flexDirection="column">
      <Span>
        {type}
      </Span>
    </Flex>

    <Flex width="60%" flexDirection="column">
      <Span>
        Title
      </Span>
      <OverflowSpan>
        {title}
      </OverflowSpan>
    </Flex>

    <Flex width="30%" justifyContent="center">
      <EditCTAButton>
        <Edit3 />
        <Span>
          Edit
        </Span>
      </EditCTAButton>
    </Flex>

  </CTAEntryContainer>
);

const ActionsPage = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const { data, loading } = useQuery(getCTANodesQuery, {
    variables: {
      dialogueSlug,
      customerSlug,
    },
  });

  const leafs = data?.customer?.dialogue?.leafs;

  if (!leafs) return <Loader />;

  return (
    <ActionOverview leafs={leafs} />
  );
};

const ActionOverview = ({ leafs }: ActionOverviewProps) => {
  const handleSearchTerm = () => null;
  return (
    <DialogueViewContainer>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" alignItems="center" width="50%">
          <H2 color="default.darkest" fontWeight={500} py={2}>Call-to-Actions</H2>
          <AddCTAButton>
            <Plus />
            <Span>
              Add
            </Span>
          </AddCTAButton>
        </Flex>
        <Div width="40%">
          <SearchBar activeSearchTerm="" onSearchTermChange={handleSearchTerm} />
        </Div>
      </Flex>
      {leafs && leafs.map((leaf: any) => <CTAEntry title={leaf.title} type={leaf.type} />)}
    </DialogueViewContainer>
  );
};

export default ActionsPage;
