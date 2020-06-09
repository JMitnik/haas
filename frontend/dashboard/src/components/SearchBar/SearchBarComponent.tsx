import { Search, XCircle } from 'react-feather';
import React, { useEffect, useState } from 'react';

import { Div } from '@haas/ui';
import useDebounce from 'hooks/useDebounce';

interface SearchBarProps {
  activeSearchTerm: string;
  handleSearchTermChange: (newSearchTerm: string) => void;
}

const SearchBarComponent = ({ activeSearchTerm, handleSearchTermChange }: SearchBarProps) => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(activeSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      handleSearchTermChange(debouncedSearchTerm);
    },
    [debouncedSearchTerm],
  );

  return (
    <Div padding={15} borderRadius="90px" useFlex flexDirection="row" alignItems="center" backgroundColor="#f1f5f8">
      { !isActive && (
        <Div useFlex alignItems="center" onClick={() => setIsActive(true)}>
          <Div color="#6d767d">SEARCH</Div>
          <Search color="#6d767d" style={{ marginLeft: '10px' }} />
        </Div>
      )}
      { isActive && (
        <Div useFlex alignItems="center">
          <input
            defaultValue={activeSearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <XCircle onClick={() => setIsActive(false)} color="#6d767d" style={{ marginLeft: '10px' }} />
        </Div>
      )}
    </Div>
  );
};

export default SearchBarComponent;
