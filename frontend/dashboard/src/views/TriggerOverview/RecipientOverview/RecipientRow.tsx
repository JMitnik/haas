import React from 'react';

import { Div, Flex } from '@haas/ui';
import { RecipientProps } from 'components/Table/TableTypes';

const RecipientRow = ({ recipient } : { recipient: RecipientProps}) => (
  <Div useFlex flexDirection="row" gridColumn="1 / -1">
    <Div>
      {'Name: '}
      {recipient.firstName}
      {' '}
      {recipient.lastName}
    </Div>
    <Div>
      {'Email: '}
      {recipient.email}
    </Div>
    <Div>
      {'Phone: '}
      {recipient.phone}
    </Div>
  </Div>
);

export default RecipientRow;
