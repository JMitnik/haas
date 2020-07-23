import React from 'react';

import { Div, Flex, Span } from '@haas/ui';
import styled, { css } from 'styled-components';

interface CTAIconProps {
  type: string;
  Icon: (props: any) => JSX.Element;
}

const CTAEntryIcon = styled(Div)`
   ${({ theme }) => css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.default.darker};
    padding: 14px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
  `}
`;

const CTAIcon = ({ type, Icon }: CTAIconProps) => (
  <Flex flexDirection="column" marginRight="50px">
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <CTAEntryIcon>
        <Icon />
      </CTAEntryIcon>
      <Span marginTop="5px" fontSize="0.6em" color="default.darker">
        {type}
      </Span>
    </Flex>
  </Flex>
);

export default CTAIcon;
