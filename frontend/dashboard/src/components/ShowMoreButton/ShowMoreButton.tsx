import { ReactComponent as ShowMoreButtonSVG } from 'assets/icons/icon-more.svg';
import Dropdown from 'components/Dropdown';
import React from 'react';
import styled, { css } from 'styled-components/macro';

const ShowMoreButtonContainer = styled.div`
  ${({ theme }) => css`
    height: 25px;
    width: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    svg circle {
      fill: ${theme.colors.gray[400]};
      transition: all cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s;
    }

    &:hover svg circle {
      fill: ${theme.colors.gray[700]};
      transition: all cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.2s;
    }
  `}
`;

interface ShowMoreButtonProps {
  renderMenu: React.ReactNode
}

const ShowMoreButton = ({ renderMenu }: ShowMoreButtonProps) => (
  <ShowMoreButtonContainer onClick={(e) => e.stopPropagation()} data-cy="ShowMoreButton">
    <Dropdown renderOverlay={renderMenu}>
      <ShowMoreButtonSVG />
    </Dropdown>
  </ShowMoreButtonContainer>
);

export default ShowMoreButton;
