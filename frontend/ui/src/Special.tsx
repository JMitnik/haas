import styled from 'styled-components/macro';
import React from 'react';


export const Hr = styled.hr``;


interface WatermarkLogoProps {
    logoUrl: string;
}

const WatermarkLogoContainer = styled.div`
    position: absolute;
    width: 175px;
    height: 175px;

    /* Put positioning smarter */
    top: 40%;
    transform: translateY(-50%);

    opacity: 0.5;

    img {
        max-width: 100%;
    }
`;

export const WatermarkLogo = ({ logoUrl }: WatermarkLogoProps) => {
    return (
        <WatermarkLogoContainer>
            <img src={logoUrl} alt="Watermark logo" />
        </WatermarkLogoContainer>
    );
};
