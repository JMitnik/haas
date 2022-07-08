import * as UI from '@haas/ui';
import { ChevronRight, Filter } from 'react-feather';
import { get } from 'lodash';
import React from 'react';
import styled, { css } from 'styled-components';

interface StatisticContainerProps {
  brand: string;
  hasHover?: boolean;
}

const StatisticContainer = styled(UI.Div) <StatisticContainerProps>`
  ${({ theme, hasHover, brand = 'main.500' }) => css`
    cursor: pointer;

    ${hasHover && css`
      &:hover {
        .header ${UI.Helper}, .header svg, .header .statistic {
          color: ${get(theme.colors, brand)};
          transition: all ${theme.transitions.normal};
        }

        .box {
          box-shadow: 0px 2px 5px -1px rgba(50, 50, 93, 0.45), 0px 1px 3px -1px rgba(0, 0, 0, 0.5) !important;
        }
      }
    `}
  `}
`;

interface StatisticsProps {
  icon: React.ReactNode;
  themeBg: string;
  themeColor: string;
  name: string;
  value: string | number;
  isFilterEnabled?: boolean;
  onNavigate: () => void;
}

export const Statistic = ({
  icon,
  themeBg,
  themeColor,
  name,
  value,
  isFilterEnabled,
  onNavigate,
}: StatisticsProps) => (
  <StatisticContainer hasHover brand={themeBg} onClick={onNavigate}>
    <UI.Flex>
      <UI.Div
        className="box"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="60px"
        height="60px"
        borderRadius={10}
        bg={themeBg}
        color={themeColor}
        style={{
          cursor: 'pointer',
          boxShadow: '0px 2px 5px -1px rgba(50, 50, 93, 0.25), 0px 1px 3px -1px rgba(0, 0, 0, 0.3)',
        }}
      >
        <UI.Icon>
          {icon}
        </UI.Icon>
      </UI.Div>

      <UI.Div className="header" ml={3} position="relative">
        <UI.Flex>
          <UI.Helper>
            {name}
          </UI.Helper>

          <UI.Icon color="off.400">
            <ChevronRight size={16} />
          </UI.Icon>
        </UI.Flex>
        {isFilterEnabled && (
          <UI.Div
            width="25px"
            height="25px"
            position="absolute"
            right={-5}
            top={-5}
            bg="gray.500"
            borderRadius={30}
            color="white"
            style={{
              boxShadow: '0px 2px 5px -1px rgba(50, 50, 93, 0.25), 0px 1px 3px -1px rgba(0, 0, 0, 0.3)',
              transform: 'translateX(110%)',
            }}
          >
            <UI.Icon display="flex" style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Filter color="white" width="60%" />
            </UI.Icon>
          </UI.Div>
        )}
        <UI.Div position="relative">
          <UI.Div position="relative" display="inline-block">
            <UI.H2 color="off.500" className="statistic">
              {value}
            </UI.H2>
          </UI.Div>
        </UI.Div>
      </UI.Div>
    </UI.Flex>
  </StatisticContainer>
);
