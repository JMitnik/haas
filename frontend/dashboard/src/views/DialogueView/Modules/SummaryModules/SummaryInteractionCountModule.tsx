import { useHistory, useParams } from 'react-router';
import React from 'react';

import { Activity } from 'react-feather';
import { Card, CardBody, CardFooter, ColumnFlex, Div, Flex, Grid, H3, Paragraph, Span, Text } from '@haas/ui';
import { Icon } from '@chakra-ui/react';

const SummaryInteractionCountModule = ({ interactionCount }: { interactionCount: number }) => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const history = useHistory();

  return (
    <Card bg="white" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`)}>
      <CardBody>
        <Flex>
          <Div p={2} mr={2}>
            <Icon size="20px" color="gray.400" as={Activity} />
          </Div>
          <Div>
            <ColumnFlex>
              <Text fontSize="1rem" fontWeight="400" color="gray.400">
                Interactions
              </Text>
              <Text color="gray.500" pt={1} fontWeight="800">
                210 interactions
              </Text>
            </ColumnFlex>
          </Div>
        </Flex>
      </CardBody>
      <CardFooter bg="gray.100">
        <Text color="gray.500">
          View all
        </Text>
      </CardFooter>
    </Card>
  );
};

export default SummaryInteractionCountModule;
