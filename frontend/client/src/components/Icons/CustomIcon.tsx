import React from 'react';

interface GenerIconContainerProps {
  logo: string,
}

const CustomIcon = ({ logo }: GenerIconContainerProps) => (
  <img alt="Icon" height="100%" width="100%" src={logo} />
);

export default CustomIcon;
