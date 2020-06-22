import { ReactComponent as ShowMoreButtonSVG } from 'assets/icons/icon-more.svg';
import Dropdown from 'components/Dropdown';
import React from 'react';
import styled, { css } from 'styled-components/macro';

const ShowMoreButtonContainer = styled.div`
  height: 25px;
  width: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ShowMoreButtonProps {
  renderMenu: React.ReactNode
}

const ShowMoreButton = ({ renderMenu }: ShowMoreButtonProps) => (
  <ShowMoreButtonContainer>
    <Dropdown renderOverlay={renderMenu}>
      <ShowMoreButtonSVG />
    </Dropdown>
  </ShowMoreButtonContainer>
);

export default ShowMoreButton;
