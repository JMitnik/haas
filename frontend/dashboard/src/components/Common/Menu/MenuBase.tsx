import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ControlledMenu, MenuState } from '@szhsin/react-menu';
import React from 'react';
import styled, { css } from 'styled-components';

const MenuContainer = styled.div`
  ${({ theme }) => css`
    .szh-menu {
      min-width: 200px;
      border-radius: 10px;
      padding: 0;
    }

    .szh-menu .szh-menu__header:first-child {
      border-radius: 10px 10px 0 0;
    }

    .szh-menu__item--hover {
      background: ${theme.colors.gray[100]};
    }

    .szh-menu__header {
      padding: 6px 12px;
      display: flex;
      font-weight: 600;
      line-height: 1rem;
      font-size: 0.7rem;
      text-transform: uppercase;
      align-items: center;
      background: ${theme.colors.gray[50]};
      letter-spacing: 0.05em;
      color: ${theme.colors.gray[500]};

      ${UI.Icon} {
        margin-right: 6px;
      }
    }

    .szh-menu__submenu > .szh-menu__item {
      padding: 4px 16px;
      color: ${theme.colors.gray[600]};
      font-weight: 600;

      ${UI.Icon} {
        max-width: 20px;
        margin-right: 12px;

        svg {
          max-width: 100%;
        }
      }
    }
  `}
`;

interface MenuBaseProps {
  children: React.ReactNode;
  anchorPoint: { x: number; y: number };
  endTransition: () => void;
  onClose: () => void;
  state?: MenuState;
}

const MotionControlledMenu = motion(ControlledMenu);

export const Base = ({ children, ...menuProps }: MenuBaseProps) => (
  <MenuContainer>
    <motion.div>
      <AnimatePresence exitBeforeEnter>
        <MotionControlledMenu {...menuProps}>
          <motion.div key={menuProps.state} exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        </MotionControlledMenu>
      </AnimatePresence>
    </motion.div>
  </MenuContainer>
);
