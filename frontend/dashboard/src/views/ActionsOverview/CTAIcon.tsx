import React from 'react';

import { Div, Flex, Span } from '@haas/ui';
import styled, { css } from 'styled-components';

interface CTAIconProps {
  type: { label: string, value: string };
  Icon: React.ReactElement;
}

const CTAEntryIcon = styled(Div)`
   ${({ theme }) => css`
    color: ${theme.colors.white};
    background-color: ${theme.colors.gray[400]};
    padding: 14px;
    border-radius: ${theme.borderRadiuses.somewhatRounded};
  `}
`;

const CTAIcon = ({ type, Icon }: CTAIconProps) => (
  <Flex flexDirection="column" marginRight="50px">
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <CTAEntryIcon>
        {Icon}
      </CTAEntryIcon>
      <Span marginTop="5px" fontSize="0.6em" color="gray.400" fontWeight={700}>
        {type.label}
      </Span>
    </Flex>
  </Flex>
);

export default CTAIcon;
