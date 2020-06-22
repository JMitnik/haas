import React from 'react';

import { InputField } from '@haas/ui';
import { ReactComponent as SearchIcon } from 'assets/icons/icon-search.svg';
import { SearchbarContainer } from './SearchbarStyles';

const Searchbar = () => {
  console.log('Hello');

  return (
    <SearchbarContainer>
      <InputField placeholder="Search" icon={<SearchIcon />} />
    </SearchbarContainer>
  );
};

export default Searchbar;
