import { ArrowRight, ChevronRight } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import React from 'react';

import { Card, CardBody, Flex, H3, Paragraph, Span } from '@haas/ui';

const SummaryInteractionCountModule = ({ interactionCount }: { interactionCount: number }) => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();

  return (
    <Card bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <CardBody>
        <H3 color="primary">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Interactions</Span>
            {/* <ChevronRight /> */}
          </Flex>
        </H3>
        <Paragraph color="app.onWhite" mt={4}>
          {!interactionCount ? (
            <h2>No interactions yet!</h2>
          ) : (
            <p>
              { interactionCount }
              {' '}
              user(s) have interacted
            </p>
          )}
        </Paragraph>
      </CardBody>
    </Card>
  );
};

export default SummaryInteractionCountModule;
