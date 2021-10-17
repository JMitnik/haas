import { useMenuState } from '@szhsin/react-menu';
import React from 'react';

export function useMenu<T>() {
  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = React.useState({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = React.useState<T>();

  const openMenu = (event: React.MouseEvent, selectedActiveItem?: T) => {
    event.preventDefault();
    setAnchorPoint({ x: event.clientX, y: event.clientY });
    setActiveItem(selectedActiveItem);
    toggleMenu(true);
  };

  const closeMenu = () => {
    toggleMenu(false);
  };

  return {
    activeItem,
    openMenu,
    closeMenu,
    menuProps: {
      ...menuProps,
      anchorPoint,
    },
  };
}
