import { ReactComponent as ShowMoreButtonSVG } from 'assets/icons/icon-more.svg';
import React from 'react';
import styled, { css } from 'styled-components';

export const ShowMoreButtonContainer = styled.button`
  ${({ theme }) => css`
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadiuses.sm}px;
    transition: all ${theme.transitions.normal};
    background: white;

    outline: none;

    svg circle {
      fill: ${theme.colors.gray[400]};
      transition: all cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s;
    }

    &:focus {
      fill: red;
    }

    &:hover, &[aria-expanded="true"] {
      background: ${theme.colors.neutral[400]};
    }

    &:hover svg circle, &[aria-expanded="true"] svg circle {
      fill: ${theme.colors.gray[600]};
      transition: all ${theme.transitions.normal};
    }
  `}
`;

export const ShowMoreButton = React.forwardRef(({ children, isChecked, ...props }: any, ref: any) => (
  <ShowMoreButtonContainer ref={ref} {...props}>
    <ShowMoreButtonSVG />
  </ShowMoreButtonContainer>
));
export default ShowMoreButton;
