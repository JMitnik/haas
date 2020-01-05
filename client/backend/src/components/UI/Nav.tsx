import styled, { css } from 'styled-components';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle } from 'react-feather';
import Logo from '../assets/Logo';

const SideNav: FC = () => {
    return (
        <SideNavContainer>
            <nav>
                    <Logo />
                <SideNavMenu>
                    <li>
                        <Home />
                        <NavLink to="/dashboard">Dashboard</NavLink>
                    </li>
                    <li>
                        <MessageCircle />
                        <NavLink to="/topic-builder">Topic builder</NavLink>
                    </li>
                </SideNavMenu>
            </nav>
        </SideNavContainer>
    )
}

const SideNavContainer = styled.div`
    ${({ theme }) => css`
        background: ${theme.colors.primary};
        padding: ${theme.gutter}px;
        color: white;
    `}
`;

const SideNavMenu = styled.ul`
    ${({ theme }) => css`
        list-style: none;

        li {
            display: flex;
            align-items: center;
            color: white;
            margin-bottom: ${theme.gutter * 2}px;
        }

        li a {
            margin-left: 10px;
            vertical-align: text-bottom;
            display: block;
            color: inherit;
            text-decoration: none;
        }
    `}
`;

export default SideNav;
