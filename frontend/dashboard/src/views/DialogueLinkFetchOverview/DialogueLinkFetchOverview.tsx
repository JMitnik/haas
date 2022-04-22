import * as UI from '@haas/ui';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { Div, Flex, Grid, ViewTitle } from '@haas/ui';
import { Grid as GridIcon, List } from 'react-feather';
import { StringParam, useQueryParams } from 'use-query-params';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { useGetDialogueLinksQuery } from 'types/generated-types';
import GlobalLoader from 'components/GlobalLoader';

import DialogueCard from './DialogueLinkFetchCard';
import styled, { css } from 'styled-components';

export const ViewBody = styled(Div) <{ isCompact?: boolean; }>`
${({ theme, isCompact, padding }) => css`
  margin: 0 auto;
  padding: ${padding ? padding.toString() : `${theme.gutter}px`};
  background: ${theme.colors.gray[50]};

  ${isCompact && css`
    max-width: 1400px;
  `}
`}
`;

const DialogueLinkFetchOverview = (
) => {
  const { t } = useTranslation();
  const [filter] = useQueryParams({
    workspaceSlug: StringParam,
  });

  const [useDialogueGridView, setUseDialogueGridView] = useState(true);

  const { data, loading } = useGetDialogueLinksQuery({
    variables: {
      input: {
        workspaceSlug: filter.workspaceSlug || 'RIEEE',
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
        {useDialogueGridView ? (
          <Grid
            gridGap={4}
            gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(300px, 1fr))']}
            gridAutoRows="minmax(200px, 1fr)"
          >

            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard key={index} dialogue={dialogue} />
            ))}
          </Grid>
        ) : (
          <Grid gridRowGap={2}>
            {filteredDialogues?.map((dialogue: any, index: any) => dialogue && (
              <DialogueCard isCompact key={index} dialogue={dialogue} />
            ))}
          </Grid>
        )}
      </UI.ViewBody>
    </>
  );
};

export default DialogueLinkFetchOverview;
