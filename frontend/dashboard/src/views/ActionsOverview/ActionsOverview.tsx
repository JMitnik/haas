import { Plus } from 'react-feather';
import { QueryLazyOptions } from '@apollo/react-hooks';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, Flex, H2, Span } from '@haas/ui';
import LinkIcon from 'components/Icons/LinkIcon';
import SearchBar from 'components/SearchBar/SearchBar';

import AddCTAButton from './components/AddCTAButton';
import CTAEntry from './components/CTAEntry';

interface ActionOverviewProps {
  leafs: Array<any>;
  fetchActions: (options?: QueryLazyOptions<Record<string, any>> | undefined) => void;
  currentSearchTerm: string;
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

const ActionOverview = ({ leafs, fetchActions, currentSearchTerm }: ActionOverviewProps) => {
  const { customerSlug, dialogueSlug } = useParams();
  const [activeSearchTerm, setActiveSearchTerm] = useState(currentSearchTerm);

  const [newCTA, setNewCTA] = useState(false);
  const [activeCTA, setActiveCTA] = useState<null | string>(null);

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    if (activeSearchTerm !== newSearchTerm) {
      setActiveSearchTerm(newSearchTerm);
    }
  }, 250), []);

  useEffect(() => {
    if (activeSearchTerm !== currentSearchTerm) {
      fetchActions({ variables: {
        customerSlug,
        dialogueSlug,
        searchTerm: activeSearchTerm,
      } });
    }
  }, [activeSearchTerm, currentSearchTerm, fetchActions, customerSlug, dialogueSlug]);

  const handleAddCTA = () => {
    setActiveCTA('-1');
    setNewCTA(true);
  };

  return (
    <DialogueViewContainer>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex marginBottom="20px" flexDirection="row" alignItems="center" width="50%">
          <H2 color="default.darkest" fontWeight={500} py={2}>Call-to-Actions</H2>
          <AddCTAButton disabled={!!activeCTA || false} onClick={() => handleAddCTA()}>
            <Plus />
            <Span>
              Add
            </Span>
          </AddCTAButton>
        </Flex>
        <Div width="40%">
          <SearchBar activeSearchTerm={activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
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
          links={[]}
          onNewCTAChange={setNewCTA}
        />
      )}
      {leafs && leafs.map(
        (leaf: any, index: number) => (
          <CTAEntry
            key={index}
            activeCTA={activeCTA}
            onActiveCTAChange={setActiveCTA}
            id={leaf.id}
            Icon={leaf.icon}
            title={leaf.title}
            type={initializeCTAType(leaf.type)}
            links={leaf.links}
            onNewCTAChange={setNewCTA}
          />
        ),
      )}
    </DialogueViewContainer>
  );
};

export default ActionOverview;
