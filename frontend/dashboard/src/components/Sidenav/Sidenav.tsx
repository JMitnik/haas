import React from "react";
import styled, { css } from "styled-components/macro";

const SidenavContainer = styled.div`
    ${({ theme }) => css`
    background: white;
    padding: ${theme.gutter * 1.5}px;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;

    ul {
        display: block;
        color: black;
        margin-top: ${theme.gutter * 2}px;

      li {
        display: flex;
        margin-bottom: ${theme.gutter}px;
        color: #a0a4a5;
      }

      a {
        display: flex;
        color: inherit;
        text-decoration: none;
        font-size: 1.3rem;

        span {
            margin-left: ${theme.gutter * 0.5}px;
            display: inline-block;
        }

        &.active {
            color: #0b1011;

            ~ svg {
            color: #0b1011;
            }
        }
        }
    }
    `}
`;

const Sidenav = ({ children }: { children: React.ReactNode }) => (
<SidenavContainer>
  {children}
</SidenavContainer>
);

export default Sidenav;
