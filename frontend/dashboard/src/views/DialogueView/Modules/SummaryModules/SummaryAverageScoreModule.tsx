import { ArrowRight, ChevronRight } from 'react-feather';
import { useParams, useHistory } from 'react-router';
import React from 'react';

import { Card, CardBody, Flex, H3, Paragraph, Span } from '@haas/ui';

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
        <Paragraph my={4}>
          {!averageScore ? (
            <p>No interactions yet!</p>
          ) : (
            <p>{ averageScore } is the score of this dialogue</p>
          )}
        </Paragraph>
      </CardBody>
    </Card>
  );
};

export default SummeryAverageScoreModule;
