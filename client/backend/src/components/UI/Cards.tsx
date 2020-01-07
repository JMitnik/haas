import styled, { css, StyledComponent } from 'styled-components';

const Card = styled.div`
    ${({ theme }) => css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${theme.gutter}px;
        border-radius: ${theme.borderRadiuses.sm};
        background: ${theme.defaultColors.alt};
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `}
`;

export default Card;
