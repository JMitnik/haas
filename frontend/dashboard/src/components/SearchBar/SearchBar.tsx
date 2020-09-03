import { Search } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

import useDebouncedEffect from 'hooks/useDebouncedEffect';

import { InputIcon, SearchbarInput, SearchbarInputContainer } from './SearchBarStyles';

interface SearchBarProps {
  activeSearchTerm: string;
  onSearchTermChange: (newSearchTerm: string) => void;
  isSearching?: boolean;
}

const SearchBar = ({ activeSearchTerm, onSearchTermChange, isSearching }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(activeSearchTerm);
  const startedRef = useRef<boolean>();

  const { t } = useTranslation();

  useDebouncedEffect(() => {
    if (typeof startedRef.current !== 'undefined') {
      onSearchTermChange(searchTerm);
      startedRef.current = false;
    }
  }, 500, [searchTerm]);

  return (
    <SearchbarInputContainer>
      <InputIcon>
        <Search />
      </InputIcon>

      <SearchbarInput
        data-cy="SearchbarInput"
        defaultValue={activeSearchTerm}
        placeholder={t('search')}
        onChange={(e) => { startedRef.current = true; setSearchTerm(e.target.value); }}
      />

    </SearchbarInputContainer>
  );
};

export default SearchBar;
