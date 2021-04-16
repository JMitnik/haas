import React from 'react';

interface GenerIconContainerProps {
  logo: string,
}

const CustomIcon = ({ logo }: GenerIconContainerProps) => (
  <img alt="Icon" height="25px" width="25px" src={logo} />
);

export default CustomIcon;
