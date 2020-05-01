import React from "react";
import styled, { css } from "styled-components/macro";

const SidenavContainer = styled.div`
    ${({ theme, isActive }: { theme: any, isActive: boolean }) => css`
    background: white;
    padding: ${theme.gutter * 1.5}px;
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;

    ${isActive && css`
      background: #392ab6;
    `}

    ul {
        display: block;
        color: black;
        margin-top: ${theme.gutter * 2}px;

      li {
        display: flex;
        margin-bottom: ${theme.gutter}px;
        color: #9088d5;
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

const Sidenav = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => {

  return (
    <SidenavContainer isActive={isActive}>
      {children}
    </SidenavContainer>
  );
};

export default Sidenav;
