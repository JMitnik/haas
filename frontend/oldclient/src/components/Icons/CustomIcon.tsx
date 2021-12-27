import React from 'react';

interface GenerIconContainerProps {
  logo: string,
}

const CustomIcon = ({ logo }: GenerIconContainerProps) => (
  <img
    alt="Icon"
    height="30px"
    width="30px"
    src={logo}
    style={{ objectFit: 'cover', width: '30px', height: '30px' }}
  />
);

export default CustomIcon;
