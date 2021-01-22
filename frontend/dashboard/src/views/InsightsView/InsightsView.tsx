import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlowProvider } from 'react-flow-renderer';

import * as UI from '@haas/ui';

import { useNavigator } from 'hooks/useNavigator';
import { ReactComponent as StarIcon } from 'assets/icons/icon-star.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/icon-users.svg';
import { ReactComponent as ExclamationIcon } from 'assets/icons/icon-exclamation-circle.svg';
import { QuestionNodeTypeEnum, useGetDialogueInsightsQuery } from 'types/generated-types';


import DialogueFlow from './DialogueFlow';
import { InsightsViewContainer } from './InsightsViewStyles';
import { DialoguePathCrumb } from 'components/DialoguePathCrumb';


export enum DialoguePathHandle {
  CRITICAL = 'critical',
  POPULAR = 'popular'
}


// TODO: Resolve with DialoguePathCrumb types
interface NodeType {
  type: QuestionNodeTypeEnum;
}

interface EdgeType {
  parentNodeId?: string | null;
  childNodeId?: string | null;
  parentNode?: NodeType | null;
  childNode?: NodeType | null;
}

export interface DialoguePathType {
  edges: string[];
  handle: DialoguePathHandle;
}


const InsightsView = () => {
  const { t } = useTranslation();
  const { dialogueSlug, customerSlug } = useNavigator();
  const [pinnedPath, setPinnedPath] = useState<DialoguePathType | null>(null);
  const [hoverPath, setHoverPath] = useState<DialoguePathType | null>(null);

  const { data } = useGetDialogueInsightsQuery({
    variables: {
      customerSlug,
      dialogueSlug
    }
  });

  const sampleBestPathIds = ["ckgmgrwys7511308godcb2m3s78", "ckgmilu7u7562668god0jf4so9t", "ckgo11r4u7711398godh366m1kn"];
  const sampleBestPathEdges = data?.customer?.dialogue?.edges.filter(
    edge => sampleBestPathIds.includes(edge.id)
  );
  const sampleBestPathCount = 111;

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
            <UI.Card onClick={() => setPinnedPath({
              edges: sampleBestPathIds,
              handle: DialoguePathHandle.POPULAR
            })}>
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
            <UI.Card onClick={() => setPinnedPath({
              edges: sampleCriticalPathIds,
              handle: DialoguePathHandle.CRITICAL
            })
            }>
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
              pinnedPath={pinnedPath}
              hoverPath={hoverPath}
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
