import * as UI from '@haas/ui';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/core';
import React from 'react';

interface PopoverBaseProps {
  children?: React.ReactNode;
  closeOnClickOutside?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const Base = ({ children, closeOnClickOutside = true, ...props }: PopoverBaseProps) => (
  <Popover closeOnBlur={closeOnClickOutside} placement="bottom-start" usePortal {...props}>
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
  header?: string;
  hasArrow?: boolean;
  hasClose?: boolean;
  children?: React.ReactNode;
  padding?: number;
  maxWidth?: number;
  arrowBg?: string;
}

export const Body = ({
  header,
  hasArrow,
  hasClose,
  children,
  padding,
  maxWidth = 400,
  arrowBg = 'white',
}: PopoverBodyProps) => (
  <PopoverContent
    maxW={maxWidth}
    borderRadius={10}
    zIndex={100000}
    borderWidth={1}
    borderColor="gray.300"
    boxShadow="0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08) !important"
  >
    {!!header && (
      <>
        <PopoverHeader>
          <UI.Helper px={2}>
            {header}
          </UI.Helper>
        </PopoverHeader>
        <PopoverCloseButton />
      </>
    )}
    {hasArrow && <PopoverArrow bg={arrowBg} />}
    {hasClose && <PopoverCloseButton />}
    <PopoverBody padding={padding}>
      {children}
    </PopoverBody>
  </PopoverContent>
);
