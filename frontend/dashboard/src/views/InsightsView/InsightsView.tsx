import React from 'react';
import { useTranslation } from 'react-i18next';

import * as UI from '@haas/ui';
import DialogueFlow from './DialogueFlow';
import { InsightsViewContainer } from './InsightsViewStyles';

const InsightsView = () => {
  const { t } = useTranslation();

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
          <DialogueFlow />
        </InsightsViewContainer>
      </UI.ViewContainer>
    </>
  )
}

export default InsightsView;
