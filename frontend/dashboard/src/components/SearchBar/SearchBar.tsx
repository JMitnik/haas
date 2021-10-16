import { Search } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { InputIcon, SearchbarInput, SearchbarInputContainer } from './SearchBarStyles';

interface SearchBarProps {
  activeSearchTerm?: string | null;
  onSearchTermChange: (newSearchTerm: string) => void;
}

const SearchBar = ({ activeSearchTerm, onSearchTermChange }: SearchBarProps) => {
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
        onChange={(e) => { startedRef.current = true; setSearchTerm(e.target.value); }}
      />

    </SearchbarInputContainer>
  );
};

export default SearchBar;
