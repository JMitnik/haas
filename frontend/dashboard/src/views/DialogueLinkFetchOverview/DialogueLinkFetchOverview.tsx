import * as UI from '@haas/ui';
import { StringParam, useQueryParams } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useGetDialogueLinksQuery } from 'types/generated-types';
import GlobalLoader from 'components/GlobalLoader';

import DialogueCard from './DialogueLinkFetchCard';

export const DialogueLinkFetchOverview = () => {
  const { t } = useTranslation();
  const [filter] = useQueryParams({
    workspaceId: StringParam,
  });

  const { data, loading } = useGetDialogueLinksQuery({
    variables: {
      input: {
        workspaceId: filter.workspaceId || '',
      },
    },
  });

  const filteredDialogues = data?.dialogueLinks;

  if (loading) return <GlobalLoader />;

  return (
    <UI.Container>
      <UI.Div padding="1em">
        <UI.DeprecatedViewTitle>
          {t('dialogues')}
        </UI.DeprecatedViewTitle>
      </UI.Div>

      <UI.ViewBody padding="1em">
        {filteredDialogues?.length === 0 && (
          <UI.Flex justifyContent="center">
            {t('no_dialogues_message')}
          </UI.Flex>
        )}
        <UI.Grid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {filteredDialogues?.map((dialogue, index) => dialogue && (
            <DialogueCard key={index} dialogue={dialogue} />
          ))}
        </UI.Grid>
      </UI.ViewBody>
    </UI.Container>
  );
};
