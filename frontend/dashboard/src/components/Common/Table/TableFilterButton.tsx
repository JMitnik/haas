import * as UI from '@haas/ui';
import React from 'react';
import styled from 'styled-components';

import { ReactComponent as IconClose } from 'assets/icons/icon-close.svg';
import { useTranslation } from 'react-i18next';

interface FilterButtonProps {
  filterKey: string;
  value: string | undefined | null;
  condition: boolean;
  onClose: () => void;
}

const FilterButtonContainer = styled(UI.Span)`
  font-weight: 600;
  line-height: 1rem;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: white;
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  border-radius: 10px;
  padding: 4px 8px;
  display: flex;
  align-items: center;

  button {
    margin-left: 10px;
    max-width: 20px !important;
    max-height: 20px;

    min-width: auto;
    min-height: auto;

    svg {
      width: 80%;
      height: 100%;
    }
  }
`;

export const FilterButton = ({ filterKey, value, onClose, condition }: FilterButtonProps) => {
  if (!condition) return null;
  const { t } = useTranslation();

  return (
    <FilterButtonContainer mr={1}>
      {t(filterKey)}
      :
      {' '}
      {value}
      <UI.IconButton
        aria-label="close"
        icon={IconClose}
        onClick={onClose}
        width={10}
        minWidth={10}
      />
    </FilterButtonContainer>
  );
};
