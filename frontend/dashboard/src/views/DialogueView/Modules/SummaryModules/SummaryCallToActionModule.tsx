import { ArrowRight, ChevronRight } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import React from 'react';

import { Card, CardBody, Flex, H3, Paragraph, Span } from '@haas/ui';

const SummaryCallToActionModule = ({ callToActionCount }: { callToActionCount: number }) => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();

  return (
    <Card bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <CardBody>
        <H3 color="tertiary">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Call to actions</Span>
            {/* <ChevronRight /> */}
          </Flex>
        </H3>
        <Paragraph color="app.onWhite" my={4}>
          {!callToActionCount ? (
            <p>No call to actions yet!</p>
          ) : (
            <p>
              { callToActionCount }
              {' '}
              user(s) have interacted with the call to actions
            </p>
          )}
        </Paragraph>
      </CardBody>
    </Card>
  );
};

export default SummaryCallToActionModule;
