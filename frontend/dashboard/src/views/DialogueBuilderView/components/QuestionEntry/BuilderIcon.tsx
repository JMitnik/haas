import React from 'react';

import { Div, Flex, Span } from '@haas/ui';
import styled, { css } from 'styled-components';

interface BuilderIconProps {
  type: string;
  Icon: React.ReactNode;
}

const BuilderEntryIcon = styled(Div)`
   ${({ theme }) => css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.default.darker};
    padding: 14px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
  `}
`;

const BuilderIcon = ({ type, Icon }: BuilderIconProps) => (
  <Flex flexDirection="column" marginRight="50px">
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <BuilderEntryIcon>
        {Icon}
      </BuilderEntryIcon>
      <Span marginTop="5px" fontSize="0.6em" color="default.darker" textAlign="center">
        {type}
      </Span>
    </Flex>
  </Flex>
);

export default BuilderIcon;
