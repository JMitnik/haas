import React from 'react';

import { Card, CardBody, CardFooter, ColumnFlex, Div, Flex, Text } from '@haas/ui';
import { Icon } from '@chakra-ui/core';
import { Icon as IconType } from 'react-feather';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

interface SummaryModuleProps {
  heading: string;
  renderIcon: IconType;
  renderMetric: string | React.ReactNode;
  fallbackMetric: string | React.ReactNode;
  isInFallback: boolean;
  renderCornerMetric?: React.ReactNode;
  renderFooterText?: string | React.ReactNode;
  onClick?: () => void;
}

const FallbackContainer = styled(Div)`
  ${({ theme }) => css`
    overflow: hidden;
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;

    > ${Text} {
      padding: ${theme.gutter}px;
      position: relative;
      z-index: 300;
    }

    > ${Div} {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(10%);
    }
  `}
`;

const CornerMetricContainer = styled(Div)`
  ${({ theme }) => css`
    position: absolute;
    top: ${theme.gutter / 2}px;
    right: ${theme.gutter / 2}px;

    svg {
      fill: currentColor;
      stroke: currentColor;

      polyline {
        fill: currentColor;
        stroke: currentColor;
      }
    }
  `}
`;

const SummaryModule = ({
  renderIcon,
  renderMetric,
  heading,
  onClick,
  isInFallback,
  fallbackMetric,
  renderFooterText,
  renderCornerMetric,
}: SummaryModuleProps) => {
  const { t } = useTranslation();

  return (
    <Card bg="white" onClick={onClick}>
      {!isInFallback ? (
        <>
          <CardBody>
            <Flex>
              <Div p={2} mr={2}>
                <Icon size="24px" color="gray.300" as={renderIcon} />
              </Div>
              <Div>
                <ColumnFlex>
                  <Text fontSize="1rem" fontWeight="400" color="gray.400">
                    {heading}
                  </Text>
                  {typeof renderMetric === 'string' ? (
                    <Text color="gray.500" pt={1} fontWeight="800">
                      {renderMetric}
                    </Text>
                  ) : renderMetric}
                </ColumnFlex>
              </Div>
            </Flex>
            <CornerMetricContainer>
              {renderCornerMetric}
            </CornerMetricContainer>
          </CardBody>
          <CardFooter bg="gray.100">
            <Text color="gray.500">
              {renderFooterText || t('view_all')}
            </Text>
          </CardFooter>
        </>
      ) : (
        <FallbackContainer>
          <Text color="gray.400" fontWeight="600" fontSize="1rem">{fallbackMetric}</Text>
          <Div>
            <Icon size="150px" color="gray.50" as={renderIcon} />
          </Div>
        </FallbackContainer>
      )}
    </Card>
  );
};

export default SummaryModule;
