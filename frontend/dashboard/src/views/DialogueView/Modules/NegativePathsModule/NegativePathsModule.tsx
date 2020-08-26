import React from 'react';

import { Card, CardBody, Div, Flex, H3, Span, Text } from '@haas/ui';
import styled, { css } from 'styled-components/macro';

import { Frown } from 'react-feather';
import { Icon } from '@chakra-ui/core';
import FallbackContainer from '../FallbackContainer';
import ModuleContainer from '../Module';

const NegativePathsModuleList = styled.ol`
  ${({ theme }) => css`
   list-style: none;
   padding: 12px 0 0 0 !important;
   counter-reset: item;
   
 
    li {
      counter-increment: item;
      color: ${theme.colors.default.darkest};
      border-bottom: 1px solid ${theme.colors.default.normalAlt};
      padding: 18px 24px;

      &:last-of-type {
        border-bottom: 0;
      }

      &::before {
        transform: translateX(-18px);
        content: counter(item);
        display: inline-block;
        color: ${theme.colors.default.darker};
        border: 2px solid #f7f8fb;
        padding: 4px;
        font-size: 0.7rem;
      }
    }
  `} 
`;

const NegativePathsModule = ({ negativePaths }: { negativePaths: any }) => (
  <ModuleContainer>
    <Card height="100%" bg="white">
      <CardBody display="flex" flexDirection="column" height="100%">
        <Text fontSize="1.3rem" color="red.200">Top negative paths</Text>
        <Flex marginTop="10px" flexGrow={1} flexDirection="column">
          {negativePaths.length > 0 && (
          <NegativePathsModuleList>
            {negativePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
              <li key={`${answer}-${quantity}`}>
                {`${answer}`}
              </li>
            ))}
          </NegativePathsModuleList>
          )}
        </Flex>
      </CardBody>
      {!negativePaths.length && (
        <FallbackContainer>
          <Text fontWeight="600" fontSize="1.2rem" color="gray.400">No negative paths recorded yet</Text>
          <Div>
            <Icon size="175px" color="gray.50" as={Frown} />
          </Div>
        </FallbackContainer>
      )}
    </Card>
    <H3 />

  </ModuleContainer>
);

export default NegativePathsModule;
