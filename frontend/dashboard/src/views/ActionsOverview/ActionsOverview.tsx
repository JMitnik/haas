import { Plus } from 'react-feather';
import { useHistory, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, Flex, H2, Span } from '@haas/ui';
import LinkIcon from 'components/Icons/LinkIcon';
import SearchBar from 'components/SearchBar/SearchBar';

import AddCTAButton from './components/AddCTAButton';
import CTAEntry from './components/CTAEntry';

interface ActionOverviewProps {
  leafs: Array<any>;
}

const DialogueViewContainer = styled(Div)`
  ${({ theme }) => css`
    padding: ${theme.gutter * 2}px 0;
  `}
`;

const initializeCTAType = (type: string) => {
  if (type === 'OPINION') {
    return { label: 'Opinion', value: 'TEXTBOX' };
  }

  if (type === 'REGISTER') {
    return { label: 'Register', value: 'REGISTRATION' };
  }

  if (type === 'LINK') {
    return { label: 'Link', value: 'SOCIAL_SHARE' };
  }

  return { label: 'None', value: '' };
};

const ActionOverview = ({ leafs }: ActionOverviewProps) => {
  const history = useHistory();
  const { customerSlug, dialogueSlug } = useParams();
  const handleSearchTerm = () => null;
  const [newCTA, setNewCTA] = useState(false);
  const [activeCTA, setActiveCTA] = useState<null | string>(null);

  const handleAddCTA = () => {
    setActiveCTA('-1');
    setNewCTA(true);
  };

  return (
    <DialogueViewContainer>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex marginBottom="20px" flexDirection="row" alignItems="center" width="50%">
          <H2 color="default.darkest" fontWeight={500} py={2}>Call-to-Actions</H2>
          {/* <AddCTAButton disabled={!!activeCTA || false} onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/add`)}> */}
          <AddCTAButton disabled={!!activeCTA || false} onClick={() => handleAddCTA()}>
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
      {newCTA && (
        <CTAEntry
          id="-1"
          activeCTA={activeCTA}
          onActiveCTAChange={setActiveCTA}
          Icon={LinkIcon}
          title=""
          type={initializeCTAType('LINK')}
          onNewCTAChange={setNewCTA}
        />
      )}
      {leafs && leafs.map(
        (leaf: any) => (
          <CTAEntry
            activeCTA={activeCTA}
            onActiveCTAChange={setActiveCTA}
            id={leaf.id}
            Icon={leaf.icon}
            title={leaf.title}
            type={initializeCTAType(leaf.type)}
            onNewCTAChange={setNewCTA}
          />
        ),
      )}
    </DialogueViewContainer>
  );
};

export default ActionOverview;
