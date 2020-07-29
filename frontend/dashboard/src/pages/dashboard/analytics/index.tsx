import React from 'react';

import { Div } from '@haas/ui';
import ComingSoonCard from 'components/ComingSoonCard';

const AnalyticsPage = () => (
  <Div height="100%" useFlex alignItems="center" justifyContent="center">
    <Div maxWidth="900px">
      <ComingSoonCard />
    </Div>
  </Div>
);

export default AnalyticsPage;
