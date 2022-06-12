import * as UI from '@haas/ui';
import React from 'react';

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

const FallbackContainer = styled(UI.Div)`
  ${({ theme }) => css`
    overflow: hidden;
    position: relative;
    height: 100%;
    display: flex;
    align-items: flex-end;

    > ${UI.Text} {
      padding: ${theme.gutter}px;
      position: relative;
      z-index: 300;
    }

    > ${UI.Div} {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(10%);
    }
  `}
`;

const CornerMetricContainer = styled(UI.Div)`
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
    <UI.NewCard onClick={onClick}>
      {!isInFallback ? (
        <>
          <UI.CardBody>
            <UI.Flex>
              <UI.Div p={2} mr={2}>
                <Icon size="24px" color="gray.300" as={renderIcon} />
              </UI.Div>
              <UI.Div>
                <UI.ColumnFlex>
                  <UI.Text fontSize="1rem" fontWeight="400" color="gray.400">
                    {heading}
                  </UI.Text>
                  {typeof renderMetric === 'string' ? (
                    <UI.Text color="gray.500" pt={1} fontWeight="800">
                      {renderMetric}
                    </UI.Text>
                  ) : renderMetric}
                </UI.ColumnFlex>
              </UI.Div>
            </UI.Flex>
            <CornerMetricContainer>
              {renderCornerMetric}
            </CornerMetricContainer>
          </UI.CardBody>
          <UI.CardFooter bg="gray.100">
            <UI.Text color="gray.500">
              {renderFooterText || t('view_all')}
            </UI.Text>
          </UI.CardFooter>
        </>
      ) : (
        <FallbackContainer>
          <UI.Text color="gray.400" fontWeight="600" fontSize="1rem">{fallbackMetric}</UI.Text>
          <UI.Div>
            <Icon size="150px" color="gray.50" as={renderIcon} />
          </UI.Div>
        </FallbackContainer>
      )}
    </UI.NewCard>
  );
};

export default SummaryModule;
