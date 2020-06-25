import { ArrowRight, ChevronRight } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import React from 'react';

import { Card, CardBody, Flex, H3, Paragraph, Span, H2 } from '@haas/ui';

const SummeryAverageScoreModule = ({ averageScore }: { averageScore: number }) => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();

  return (
    <Card bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <CardBody>
        <H3 color="secondary">
          <Flex justifyContent="space-between" alignItems="center">
            <Span>Performance</Span>
            {/* <ChevronRight /> */}
          </Flex>
        </H3>
        <Paragraph mt={4} color="app.onWhite">
          {!averageScore ? (
            <p>No interactions yet!</p>
          ) : (
            <p>
              <H2 color="default.darkest">
                { Number(averageScore).toFixed(2) }
              </H2>
              {' '}
              <Span color="default.darker">
                is the score of this dialogue
              </Span>
            </p>
          )}
        </Paragraph>
      </CardBody>
    </Card>
  );
};

export default SummeryAverageScoreModule;
