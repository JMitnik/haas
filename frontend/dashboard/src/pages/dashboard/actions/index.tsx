import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import React from 'react';

import { Loader } from '@haas/ui';
import ActionOverview from 'views/ActionsOverview/ActionsOverview';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import getCTANodesQuery from 'queries/getCTANodes';

const ActionsPage = () => {
  const { dialogueSlug, customerSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();

  const { data, loading } = useQuery(getCTANodesQuery, {
    variables: {
      dialogueSlug,
      customerSlug,
      searchTerm: '',
    },
    onCompleted: () => {
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const leafs = data?.customer?.dialogue?.leafs;

  if (!leafs || loading) return <Loader />;

  const mappedLeafs = leafs.map((leaf: any) => {
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
    return { ...leaf, icon: RegisterIcon };
  });

  return (
    <ActionOverview leafs={mappedLeafs} />
  );
};

export default ActionsPage;
