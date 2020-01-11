import styled, { css } from 'styled-components';

const Flex = styled.div`
  ${({ theme }) => css`
    display: flex;
    padding: ${theme.gutter}px;
    align-items: center;
  `
}`;

export default Flex;
