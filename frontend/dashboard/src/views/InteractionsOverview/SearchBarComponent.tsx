import React, { useState, useEffect } from 'react';
import {
    Div
} from '@haas/ui';
import { XCircle, Search } from 'react-feather'
import useDebounce from 'hooks/useDebounce';


const SearchBarComponent = ({ activeSearchTerm, handleSearchTermChange }: { activeSearchTerm: string, handleSearchTermChange: ( newSearchTerm: string) => void}) => {
    const [isActive, setIsActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>(activeSearchTerm);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(
        () => {
            handleSearchTermChange(debouncedSearchTerm);
        },
        [debouncedSearchTerm] 
    );

    return (
        <Div padding={15} style={{ borderRadius: '90px' }} useFlex flexDirection='row' alignItems='center' backgroundColor='#f1f5f8'>
            {
                !isActive &&
                <Div useFlex alignItems='center' onClick={() => setIsActive(true)}>
                    <Div style={{ color: '#6d767d' }}>SEARCH</Div>
                    <Search style={{ color: '#6d767d', marginLeft: '10px' }} />
                </Div>
            }
            {
                isActive &&
                <Div useFlex alignItems='center' >
                    <input defaultValue={activeSearchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }} />
                    <XCircle onClick={() => setIsActive(false)} style={{ color: '#6d767d', marginLeft: '10px' }} />
                </Div>
            }
        </Div>
    )
}

export default SearchBarComponent;
