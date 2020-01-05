import React from 'react'
import styled from 'styled-components';

const LogoContainer = styled.a`
    display: block;

    /* Manual size */

    width: 200px;
    max-width: 100%;
    height: 100px;
`;

const Logo = () => (
    <LogoContainer>
        <img src="" alt="HAAS Logo"/>
    </LogoContainer>
)

export default Logo;
