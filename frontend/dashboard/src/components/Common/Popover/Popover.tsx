import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/core';
import React from 'react';

interface PopoverBaseProps {
  children?: React.ReactNode;
  onClose?: any;
  onOpen?: any;
}

export const Base = ({ children, ...props }: PopoverBaseProps) => (
  <Popover usePortal {...props}>
    {children}
  </Popover>
);

interface PopoverTriggerProps {
  children?: React.ReactNode;
}

export const Trigger = ({ children }: PopoverTriggerProps) => (
  <PopoverTrigger>
    {children}
  </PopoverTrigger>
);

interface PopoverBodyProps {
  hasArrow?: boolean;
  children?: React.ReactNode;
}

export const Body = ({ hasArrow, children }: PopoverBodyProps) => (
  <PopoverContent
    borderRadius={10}
    borderWidth={1}
    borderColor="gray.300"
    py={1}
    px={2}
    boxShadow="0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08) !important"
  >
    {hasArrow && <PopoverArrow />}
    <PopoverBody>
      {children}
    </PopoverBody>
  </PopoverContent>
);
