import React from 'react';

import { Card, CardBody, ColumnFlex, Div, H4, Paragraph } from '@haas/ui';
import { ReactComponent as InDevImage } from 'assets/images/undraw_dev.svg';

const ComingSoonCard = () => (
  <Div>
    <Card bg="white" p="4">
      <CardBody>
        <ColumnFlex alignItems="center">
          <H4>Stay Tuned!</H4>
          <Paragraph>Our engineers will make you even more happy soon!</Paragraph>
        </ColumnFlex>

        <Div margin="0 auto" maxWidth="50%" mt="4">
          <InDevImage width="100%" height="auto" />
        </Div>
      </CardBody>
    </Card>
  </Div>
);

export default ComingSoonCard;
