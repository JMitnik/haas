import React from 'react';

import { InputField } from '@haas/ui';
import { ReactComponent as SearchIcon } from 'assets/icons/icon-search.svg';
import { SearchbarContainer } from './SearchbarStyles';

const Searchbar = () => (
  <SearchbarContainer>
    <InputField placeholder="Search" icon={<SearchIcon />} />
  </SearchbarContainer>
);

export default Searchbar;
