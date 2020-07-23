import { Crosshair, Search, X, XCircle } from 'react-feather';
import React, { useEffect, useState } from 'react';

import useDebounce from 'hooks/useDebounce';

import { EmptyInputIcon, InputIcon, SearchbarInput, SearchbarInputContainer } from './SearchBarStyles';

interface SearchBarProps {
  activeSearchTerm: string;
  onSearchTermChange: (newSearchTerm: string) => void;
}

const SearchBar = ({ activeSearchTerm, onSearchTermChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(activeSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearchTermChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchTermChange]);

  return (
    <SearchbarInputContainer>
      <InputIcon>
        <Search />
      </InputIcon>
      <SearchbarInput
        defaultValue={activeSearchTerm}
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!!searchTerm.length && (
        <EmptyInputIcon>
          <X />
        </EmptyInputIcon>
      )}
    </SearchbarInputContainer>
  );
};

export default SearchBar;
