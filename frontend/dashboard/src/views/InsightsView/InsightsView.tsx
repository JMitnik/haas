import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlowProvider } from 'react-flow-renderer';

import * as UI from '@haas/ui';

import { useNavigator } from 'hooks/useNavigator';
import { ReactComponent as StarIcon } from 'assets/icons/icon-star.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-users.svg';
import { ReactComponent as ExclamationIcon } from 'assets/icons/icon-exclamation-circle.svg';


import DialogueFlow from './DialogueFlow';
import { InsightsViewContainer } from './InsightsViewStyles';
import { useGetDialogueInsightsQuery } from 'types/generated-types';
import { DialoguePathCrumb } from 'components/DialoguePathCrumb';

const InsightsView = () => {
  const { t } = useTranslation();
  const { dialogueSlug, customerSlug } = useNavigator();

  const { data } = useGetDialogueInsightsQuery({
    variables: {
      customerSlug,
      dialogueSlug
    }
  });

  const sampleBestPathIds = ["ckgmgt9vo7513188godeqsj2cny", "ckgmjwe3m7588738godpr4aos25", "ckgw41bl616533828godce5wvzsv"];
  const sampleBestPathEdges = data?.customer?.dialogue?.edges.filter(
    edge => sampleBestPathIds.includes(edge.id)
  );
  const sampleBestPathCount = 22;

  const sampleCriticalPathIds = ["ckgmgunr87515798godj5qgrnra", "ckgmjyva67591828godn437dtyc"];
  const sampleCriticalPathEdges = data?.customer?.dialogue?.edges.filter(
    edge => sampleCriticalPathIds.includes(edge.id)
  );
  const sampleWorstPathCount = 30;

  return (
    <>
      <UI.ViewHeading>
        <UI.PageTitle>
          {t('views:insights_view')}
        </UI.PageTitle>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <InsightsViewContainer gridGap={4} gridTemplateColumns={['1fr', '1fr 2fr']}>
          <UI.Stack spacing={4}>
            <UI.Card noHover>
              <UI.CardHeader color="blue.500">
                <UI.Icon mr={1}><StarIcon width="1rem" /></UI.Icon>
                <UI.Helper color="blue.500">{t('most_popular_path')}</UI.Helper>
              </UI.CardHeader>
              <UI.CardBody>
                <UI.Flex justifyContent="space-between">
                  <UI.ColumnFlex>
                    <UI.Text color="blue.400" fontWeight="600" fontSize="1.5rem">{sampleBestPathCount}</UI.Text>
                    <UI.Label variantColor="blue">
                      <UI.Icon mr={1}><UsersIcon width="1.2rem" /></UI.Icon>
                      <UI.Text>Interactions</UI.Text>
                    </UI.Label>
                  </UI.ColumnFlex>
                  <DialoguePathCrumb
                    dialoguePath={{ edges: sampleBestPathEdges || [] }}
                  />
                </UI.Flex>
              </UI.CardBody>
            </UI.Card>
            <UI.Card noHover>
              <UI.CardHeader color="red.500">
                <UI.Icon mr={1}><ExclamationIcon width="1rem" /></UI.Icon>
                <UI.Helper color="red.500">{t('most_critical_path')}</UI.Helper>
              </UI.CardHeader>
              <UI.CardBody>
                <UI.Flex justifyContent="space-between">
                  <UI.ColumnFlex>
                    <UI.Text color="red.400" fontWeight="600" fontSize="1.5rem">{sampleWorstPathCount}</UI.Text>
                    <UI.Label variantColor="red">
                      <UI.Icon mr={1}><UsersIcon width="1.2rem" /></UI.Icon>
                      <UI.Text>Interactions</UI.Text>
                    </UI.Label>
                  </UI.ColumnFlex>
                  <DialoguePathCrumb
                    dialoguePath={{ edges: sampleCriticalPathEdges || [] }}
                  />
                </UI.Flex>
              </UI.CardBody>
            </UI.Card>
          </UI.Stack>
          <ReactFlowProvider>
            <DialogueFlow
              edges={data?.customer?.dialogue?.edges || []}
              nodes={data?.customer?.dialogue?.questions || []}
            />
          </ReactFlowProvider>
        </InsightsViewContainer>
      </UI.ViewContainer>
    </>
  )
}

export default InsightsView;
