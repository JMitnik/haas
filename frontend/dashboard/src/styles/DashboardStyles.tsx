import styled, { css } from 'styled-components/macro';

export const DashboardLayout = styled.div`
    ${({ theme }) => css`
        display: grid;
        grid-template-columns: 300px 1fr;
        background: #e8eeee;
        height: 100vh;

        > * {
            padding-top: ${theme.gutter * 2}px;
        }
    `}
`;
