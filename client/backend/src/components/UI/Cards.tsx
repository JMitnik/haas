import styled, { css, StyledComponent } from 'styled-components';

const Card = styled.div`
    ${({ theme }) => css`
        display: block;
        padding: ${theme.colors.primary};
    `}
`;

export default Card;
