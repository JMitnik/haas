import * as UI from '@haas/ui';
import { Filter } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React from 'react';

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
}: StatisticsProps) => {
  const { t } = useTranslation();

  return (
    <UI.Div>
      <UI.Flex>
        <UI.Div
          onClick={onNavigate}
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

        <UI.Div ml={3} position="relative">
          <UI.Helper>
            {name}
          </UI.Helper>
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
                <Filter width="60%" />
              </UI.Icon>
            </UI.Div>
          )}
          <UI.Div position="relative">
            <UI.Div position="relative" display="inline-block">
              <UI.H2 color="off.500">
                {value}
              </UI.H2>
            </UI.Div>
          </UI.Div>
        </UI.Div>
      </UI.Flex>
    </UI.Div>
  );
};
