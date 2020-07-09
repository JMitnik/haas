import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import React from 'react';

import { Loader } from '@haas/ui';
import ActionOverview from 'views/ActionsOverview/ActionsOverview';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import getCTANodesQuery from 'queries/getCTANodes';

const ActionsPage = () => {
  const { dialogueSlug, customerSlug } = useParams();
  const { data } = useQuery(getCTANodesQuery, {
    variables: {
      dialogueSlug,
      customerSlug,
    },
  });

  const leafs = data?.customer?.dialogue?.leafs;

  if (!leafs) return <Loader />;

  const mappedLeafs = leafs.map((leaf: any) => {
    if (leaf.type === 'SOCIAL_SHARE') {
      return { ...leaf, type: 'LINK', icon: LinkIcon };
    }
    if (leaf.type === 'REGISTRATION') {
      return { ...leaf, type: 'REGISTER', icon: RegisterIcon };
    }
    if (leaf.type === 'TEXTBOX') {
      return { ...leaf, type: 'OPINION', icon: OpinionIcon };
    }
  });

  return (
    <ActionOverview leafs={mappedLeafs} />
  );
};

export default ActionsPage;
