import React from 'react';

import { Card, CardBody, Div, Flex, Text } from '@haas/ui';
import styled, { css } from 'styled-components';

import { Icon } from '@chakra-ui/react';
import { Smile } from 'react-feather';
import { useTranslation } from 'react-i18next';
import FallbackContainer from '../FallbackContainer';
import ModuleContainer from '../Module';

const PostivePathsModuleList = styled.ol`
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

const PositivePathsModule = ({ positivePaths }: { positivePaths: any }) => {
  const { t } = useTranslation();

  return (
    <ModuleContainer>
      <Card bg="white">
        <CardBody display="flex" flexDirection="column">
          <Text fontSize="1.3rem" color="teal.200">{t('dialogue:top_positive_paths')}</Text>
          <Flex marginTop="10px" flexGrow={1} flexDirection="column">
            {positivePaths.length > 0 && (
              <PostivePathsModuleList>
                {positivePaths.map(({ answer, quantity }: { answer: string, quantity: number }) => (
                  <li key={`${answer}-${quantity}`}>
                    {`${answer}`}
                  </li>
                ))}
              </PostivePathsModuleList>
            )}

          </Flex>
        </CardBody>
        {!positivePaths.length && (
          <FallbackContainer>
            <Text fontWeight="600" fontSize="1.2rem" color="gray.400">{t('dialogue:fallback_no_positive_paths')}</Text>
            <Div>
              <Icon size="175px" color="gray.50" as={Smile} />
            </Div>
          </FallbackContainer>
        )}
      </Card>
    </ModuleContainer>
  );
};

export default PositivePathsModule;
