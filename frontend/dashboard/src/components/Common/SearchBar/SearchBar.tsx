import * as UI from '@haas/ui';
import { Search } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { InputIcon, SearchbarInput, SearchbarInputContainer } from './SearchBarStyles';

interface SearchBarProps {
  search?: string | null;
  onSearchChange: (newSearch: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ search: activeSearchTerm, onSearchChange: onSearchTermChange, isLoading }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(activeSearchTerm ?? '');
  const startedRef = useRef<boolean>();

  const { t } = useTranslation();

  useDebouncedEffect(() => {
    if (typeof startedRef.current !== 'undefined' && searchTerm !== undefined && searchTerm !== null) {
      onSearchTermChange(searchTerm);
      startedRef.current = false;
    }
  }, 500, [searchTerm]);

  useEffect(() => {
    if (!startedRef.current) {
      setSearchTerm(activeSearchTerm || '');
    }
  }, [activeSearchTerm, setSearchTerm]);

  return (
    <SearchbarInputContainer>
      <InputIcon>
        <Search />
      </InputIcon>

      <SearchbarInput
        data-cy="SearchbarInput"
        value={searchTerm ?? ''}
        placeholder={t('search')}
        muted={isLoading}
        onChange={(e) => { startedRef.current = true; setSearchTerm(e.target.value); }}
      />

      {isLoading && (
        <UI.Loader />
      )}

    </SearchbarInputContainer>
  );
};

export default SearchBar;
