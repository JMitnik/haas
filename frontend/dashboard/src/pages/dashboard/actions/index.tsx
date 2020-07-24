import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import { Loader } from '@haas/ui';
import ActionOverview from 'views/ActionsOverview/ActionsOverview';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import getCTANodesQuery from 'queries/getCTANodes';

const ActionsPage = () => {
  const { dialogueSlug, customerSlug } = useParams();

  const [fetchActions, { data, variables }] = useLazyQuery(getCTANodesQuery, {
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  useEffect(() => {
    fetchActions({ variables: {
      dialogueSlug,
      customerSlug,
      searchTerm: '',
    } });
  }, [dialogueSlug, customerSlug, fetchActions]);

  const leafs = data?.customer?.dialogue?.leafs;

  if (!leafs) return <Loader />;

  const mappedLeafs = leafs.map((leaf: any) => {
    if (leaf.type === 'SOCIAL_SHARE') {
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
      return { ...leaf, type: 'OPINION', icon: OpinionIcon };
    }

    return null;
  });

  const { searchTerm } = variables;

  return (
    <ActionOverview fetchActions={fetchActions} leafs={mappedLeafs} currentSearchTerm={searchTerm} />
  );
};

export default ActionsPage;
