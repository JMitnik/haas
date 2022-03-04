import * as UI from '@haas/ui';
import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { lighten } from '../Theme/colorUtils';
import { useNavigator } from './useNavigator';
import { useDialogueParams } from './useDialogueParams';

interface NotFoundProps {
  children?: React.ReactNode;
}

const NotFoundContainer = styled(UI.Div)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    width: 100%;
    margin: ${theme.gutter}px;
    border: 1px solid ${lighten(theme.colors._primary, 0.8)};
    background: ${lighten(theme.colors._primary, 0.6)};
    border-radius: ${theme.borderRadiuses.md};

    ${UI.H2} {
      font-size: 1.8rem;
    }

    ${UI.H4} {
      font-size: 1.2rem;
    }
  `}
`;

export const NotFound = ({ children }: NotFoundProps) => {
  const { t } = useTranslation();
  const { workspace, dialogue } = useDialogueParams();

  const { goToStart } = useNavigator({ dialogueSlug: dialogue, workspaceSlug: workspace });

  return (
    <NotFoundContainer>
      <UI.Div>
        <UI.Div mb={8}>
          <UI.H2>
            {t('whoops')}
          </UI.H2>

          <UI.H4>
            {t('whoops_description')}
          </UI.H4>
        </UI.Div>

        <UI.Button bg="white" color="black" onClick={goToStart}>
          {t('start_dialogue')}
        </UI.Button>
      </UI.Div>
    </NotFoundContainer>
  );
};

export default NotFound;
