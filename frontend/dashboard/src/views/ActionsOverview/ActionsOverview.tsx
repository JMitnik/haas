import { Plus } from 'react-feather';
import { QueryLazyOptions, useLazyQuery } from '@apollo/react-hooks';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components/macro';

import { Div, Flex, H2, Loader, Span } from '@haas/ui';
import LinkIcon from 'components/Icons/LinkIcon';

import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SearchBar from 'components/SearchBar/SearchBar';
import getCTANodesQuery from 'queries/getCTANodes';

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

const mapLeafs = (leafs: any) => leafs?.map((leaf: any) => {
  if (leaf.type === 'LINK') {
    const mappedLinks = leaf.links?.map((link: any) => {
      const { __typename, ...linkedData } = link;
      return { ...linkedData, type: { label: link.type, value: link.type } };
    });

    return { ...leaf, type: 'LINK', icon: LinkIcon, links: mappedLinks };
  }

  if (leaf.type === 'REGISTRATION') {
    return { ...leaf, type: 'REGISTER', icon: RegisterIcon };
  }

  if (leaf.type === 'TEXTBOX') {
    return { ...leaf, type: 'TEXTBOX', icon: OpinionIcon };
  }

  return null;
});

const initializeCTAType = (type: string) => {
  if (type === 'TEXTBOX') {
    return { label: 'Opinion', value: 'TEXTBOX' };
  }

  if (type === 'REGISTER') {
    return { label: 'Register', value: 'REGISTRATION' };
  }

  if (type === 'LINK') {
    return { label: 'Link', value: 'LINK' };
  }

  return { label: 'None', value: '' };
};

const ActionOverview = ({ leafs }: ActionOverviewProps) => {
  const { customerSlug, dialogueSlug } = useParams();
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  const [newCTA, setNewCTA] = useState(false);
  const [activeCTA, setActiveCTA] = useState<null | string>(null);

  const handleSearchTermChange = useCallback(debounce((newSearchTerm: string) => {
    setActiveSearchTerm(newSearchTerm);
  }, 250), []);

  const [fetchActions, { data, variables }] = useLazyQuery(getCTANodesQuery, {
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    fetchActions({ variables: {
      customerSlug,
      dialogueSlug,
      searchTerm: activeSearchTerm,
    } });
  }, [activeSearchTerm, fetchActions, customerSlug, dialogueSlug]);

  const handleAddCTA = () => {
    setActiveCTA('-1');
    setNewCTA(true);
  };

  const activeLeafs = mapLeafs(data?.customer?.dialogue?.leafs);

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

      {!activeLeafs && leafs && leafs.map(
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

      {activeLeafs && activeLeafs?.map(
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
