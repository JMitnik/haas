import { Search } from 'react-feather';
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

  console.log('isSearching', isSearching);

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
        placeholder="Search"
        onChange={(e) => { startedRef.current = true; setSearchTerm(e.target.value); }}
      />

    </SearchbarInputContainer>
  );
};

export default SearchBar;
