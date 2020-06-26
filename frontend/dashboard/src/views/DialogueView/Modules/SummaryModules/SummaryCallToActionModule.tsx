import { useHistory, useParams } from 'react-router';
import React from 'react';

import { Card, CardBody, Flex, H2, H3, Paragraph, Span } from '@haas/ui';

const SummaryCallToActionModule = ({ callToActionCount }: { callToActionCount: number }) => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();

  return (
    <Card bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <CardBody useFlex flexDirection="column" justifyContent="space-between" height="100%">
        <H3 color="tertiary">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Call to actions</Span>
            {/* <ChevronRight /> */}
          </Flex>
        </H3>
        <Paragraph color="app.onWhite" mt={4}>
          {!callToActionCount ? (
            <H2 color="default.darkest" mb={2}>No call to actions yet</H2>
          ) : (
            <p>
              <H2 color="default.darkest">
                { callToActionCount }
              </H2>
              {' '}
              <Span color="default.darker">
                user(s) have interacted with the call to actions

                is the score of this dialogue
              </Span>
            </p>
          )}
        </Paragraph>
      </CardBody>
    </Card>
  );
};

export default SummaryCallToActionModule;
