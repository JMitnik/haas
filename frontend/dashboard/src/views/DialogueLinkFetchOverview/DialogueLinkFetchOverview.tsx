import * as UI from '@haas/ui';
import { Grid, ViewTitle } from '@haas/ui';
import { StringParam, useQueryParams } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useGetDialogueLinksQuery } from 'types/generated-types';
import GlobalLoader from 'components/GlobalLoader';

import DialogueCard from './DialogueLinkFetchCard';

const DialogueLinkFetchOverview = (
) => {
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
    <>
      <UI.Div padding="1em">
        <UI.ViewTitle>
          <ViewTitle>{t('dialogues')}</ViewTitle>
        </UI.ViewTitle>
      </UI.Div>

      <UI.ViewBody padding="1em">
        {filteredDialogues?.length === 0 && (
          <UI.Flex justifyContent="center">No Dialogues available for this workspace...</UI.Flex>
        )}
        <Grid
          gridGap={4}
          gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
          gridAutoRows="minmax(200px, 1fr)"
        >
          {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
            <DialogueCard key={index} dialogue={dialogue} />
          ))}
        </Grid>

      </UI.ViewBody>
    </>
  );
};

export default DialogueLinkFetchOverview;
