import * as UI from '@haas/ui';
import { StringParam, useQueryParams } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { View } from 'layouts/View';
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

  const dialogueUnit = 'teams'; // TODO: Make this dependent on the data
  const visitorUnit = 'people'; // TODO: Make this dependent on the data

  return (
    <View documentTitle="haas | Guest dialogues">
      <UI.Container>
        <UI.ViewHead>
          <UI.ViewTitle>
            {t(dialogueUnit)}
          </UI.ViewTitle>
          <UI.ViewSubTitle>
            {t('dialogues_guest_helper', { unit: visitorUnit })}
          </UI.ViewSubTitle>
        </UI.ViewHead>
      </UI.Container>

      <UI.Container>
        <UI.ViewBody>
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
    </View>
  );
};
