import * as UI from '@haas/ui';
import styled, { css } from 'styled-components';

export const SubNav = styled.ul`
  ${({ theme }) => css`
    border-radius: 0 0 5px 5px;
    padding: 12px;
    background: ${theme.colors.gray[100]};
    border-top: 1px solid ${theme.colors.gray[200]};
  `}
`;

interface SubNavItemProps {
  isDisabled?: boolean;
}

export const SubNavItem = styled.li<SubNavItemProps>`
  ${({ theme, isDisabled }) => css`
    a {
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      margin: 0 ${theme.gutter / 2}px;
      color: ${theme.isDarkColor ? theme.colors.primaries[500] : theme.colors.primaries[800]};
      padding: 4px 12px ;
    }

    svg {
      width: 12px;
    }

    > a.active {
      color: white;
      background: ${theme.colors.primaryGradient};
      border-radius: ${theme.borderRadiuses.somewhatRounded};
    }

    ${isDisabled && css`
      pointer-events: none;
      opacity: 0.3;
    `}
  `}
`;

export const DashboardViewContainer = styled(UI.Div)`
  ${({ theme }) => css`
    ${UI.PageHeading} {
      color: ${theme.colors.app.onDefault};
    }
  `}
`;

export const NavItems = styled.div``;
