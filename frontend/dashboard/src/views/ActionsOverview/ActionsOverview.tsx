import { Mail, Plus } from 'react-feather';
import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';

import { Div, Flex, PageTitle } from '@haas/ui';
import LinkIcon from 'components/Icons/LinkIcon';

import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SearchBar from 'components/SearchBar/SearchBar';
import getCTANodesQuery from 'queries/getCTANodes';

import { Button, Icon } from '@chakra-ui/core';
import { Variants, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ShareIcon from 'components/Icons/ShareIcon';
import CTAEntry from './components/CTAEntry';

interface ActionOverviewProps {
  leafs: Array<any>;
}

const actionsAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const DialogueViewContainer = styled(Div)``;

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

  if (leaf.type === 'SHARE') {
    return { ...leaf, type: 'SHARE', icon: ShareIcon };
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

  if (type === 'SHARE') {
    return { label: 'Share', value: 'SHARE' };
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

  const [fetchActions, { data }] = useLazyQuery(getCTANodesQuery, {
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

  const { t } = useTranslation();

  const activeLeafs = mapLeafs(data?.customer?.dialogue?.leafs);

  return (
    <DialogueViewContainer>
      <PageTitle>
        <Icon as={Mail} mr={1} />
        {t('views:cta_view')}
      </PageTitle>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Button size="sm" variant="outline" leftIcon={Plus} isDisabled={!!activeCTA || false} onClick={() => handleAddCTA()}>
          {t('add_call_to_action')}
        </Button>
        <SearchBar activeSearchTerm={activeSearchTerm} onSearchTermChange={handleSearchTermChange} />
      </Flex>
      <motion.div variants={actionsAnimation} initial="inital" animate="animate">
        {newCTA && (
          <CTAEntry
            id="-1"
            activeCTA={activeCTA}
            onActiveCTAChange={setActiveCTA}
            Icon={RegisterIcon}
            title=""
            type={initializeCTAType('REGISTER')}
            links={[]}
            share={{ title: '', url: '', tooltip: '' }}
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
              share={leaf?.share}
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
              share={leaf?.share}
              onNewCTAChange={setNewCTA}
            />
          ),
        )}
      </motion.div>
    </DialogueViewContainer>
  );
};

export default ActionOverview;
