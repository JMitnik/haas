import * as UI from '@haas/ui';
import { AnimateSharedLayout, Variants, motion } from 'framer-motion';
import { Button, Icon } from '@chakra-ui/core';
import { DeprecatedViewTitle, Div, Flex } from '@haas/ui';
import { Mail, Plus } from 'react-feather';
import { debounce } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import SearchBar from 'components/Common/SearchBar/SearchBar';
import ShareIcon from 'components/Icons/ShareIcon';
import getCTANodesQuery from 'queries/getCTANodes';

import CTACard from './CTACard';

interface ActionOverviewProps {
  leafs: Array<any>;
}

const actionsAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
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

  if (leaf.type === 'FORM') {
    return { ...leaf, type: 'FORM', icon: RegisterIcon };
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

  if (type === 'FORM') {
    return { label: 'Form', value: 'FORM' };
  }

  return { label: 'None', value: '' };
};

const ActionOverview = ({ leafs }: ActionOverviewProps) => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
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
    fetchActions({
      variables: {
        customerSlug,
        dialogueSlug,
        searchTerm: activeSearchTerm,
      },
    });
  }, [activeSearchTerm, fetchActions, customerSlug, dialogueSlug]);

  const handleAddCTA = () => {
    setActiveCTA('-1');
    setNewCTA(true);
  };

  const { t } = useTranslation();

  const activeLeafs = mapLeafs(data?.customer?.dialogue?.leafs);

  return (
    <>
      <UI.ViewHead>
        <UI.Flex justifyContent="space-between" width="100%">
          <UI.Flex alignItems="center">
            <DeprecatedViewTitle leftIcon={<Mail />}>
              {t('views:cta_view')}
            </DeprecatedViewTitle>

            <UI.Button
              leftIcon={Plus}
              variantColor="teal"
              ml={4}
              size="sm"
              onClick={() => handleAddCTA()}
            >
              {t('add_call_to_action')}
            </UI.Button>
          </UI.Flex>

          <SearchBar search={activeSearchTerm} onSearchChange={handleSearchTermChange} />
        </UI.Flex>
      </UI.ViewHead>

      <UI.ViewBody>
        <AnimateSharedLayout>
          <motion.div variants={actionsAnimation} initial="initial" animate="animate">
            {newCTA && (
              <CTACard
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
                <CTACard
                  key={index}
                  activeCTA={activeCTA}
                  onActiveCTAChange={setActiveCTA}
                  id={leaf.id}
                  Icon={leaf.icon}
                  title={leaf.title}
                  type={initializeCTAType(leaf.type)}
                  links={leaf.links}
                  share={leaf?.share}
                  form={leaf?.form}
                  onNewCTAChange={setNewCTA}
                />
              ),
            )}

            {activeLeafs && activeLeafs?.map(
              (leaf: any, index: number) => (
                <CTACard
                  key={index}
                  activeCTA={activeCTA}
                  onActiveCTAChange={setActiveCTA}
                  id={leaf.id}
                  Icon={leaf.icon}
                  title={leaf.title}
                  type={initializeCTAType(leaf.type)}
                  links={leaf.links}
                  share={leaf?.share}
                  form={leaf?.form}
                  onNewCTAChange={setNewCTA}
                />
              ),
            )}
          </motion.div>
        </AnimateSharedLayout>
      </UI.ViewBody>

    </>
  );
};

export default ActionOverview;
