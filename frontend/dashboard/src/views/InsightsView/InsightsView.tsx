import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactFlowProvider } from 'react-flow-renderer';

import * as UI from '@haas/ui';

import { useNavigator } from 'hooks/useNavigator';

import DialogueFlow from './DialogueFlow';
import { InsightsViewContainer } from './InsightsViewStyles';
import { useGetDialogueInsightsQuery } from 'types/generated-types';

const InsightsView = () => {
  const { t } = useTranslation();
  const { dialogueSlug, customerSlug } = useNavigator();

  const { data } = useGetDialogueInsightsQuery({
    variables: {
      customerSlug,
      dialogueSlug
    }
  });

  return (
    <>
      <UI.ViewHeading>
        <UI.PageTitle>
          {t('views:insights_view')}
        </UI.PageTitle>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <InsightsViewContainer gridTemplateColumns={['1fr', '1fr 2fr']}>
          <UI.Div>
          </UI.Div>
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
