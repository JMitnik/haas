import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';
import styled from 'styled-components';

const ModuleContainer = styled(UI.Div)`
    background: #f7f9fe;
    border-radius: 12px;
    overflow: hidden;

    ol {
        padding: 12px 24px;
    }
`;

interface ModuleProps {
  isLoading: boolean;
  isEmpty?: boolean;
  children?: React.ReactNode;
}

export const Module = ({ isLoading, isEmpty, children }: ModuleProps) => {
  const { t } = useTranslation();
  return (
    <UI.Skeleton isLoading={isLoading} isRefreshing={isLoading}>
      <UI.Card bg="red">
        {isEmpty ? (
          <UI.Text>
            {t('data_is_empty')}
            !
          </UI.Text>
        ) : (
          <>
            {children}
          </>
        )}
      </UI.Card>
    </UI.Skeleton>
  );
};

export default ModuleContainer;
