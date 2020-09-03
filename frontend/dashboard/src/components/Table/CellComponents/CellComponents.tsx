import { Div, Flex, Span, Text } from '@haas/ui';
import React from 'react';

import { GenericCellProps } from '../TableTypes';

export const GenericCell = ({ value }: GenericCellProps) => (
  <Div>
    <Text color="gray.500" fontWeight="600">{value}</Text>
  </Div>
);

export const CenterCell = ({ value }: GenericCellProps) => (
  <Flex alignItems="center" justifyContent="center">
    <Div display="inline-block">
      <Span fontSize="1.2em" fontWeight={900}>{value}</Span>
    </Div>
  </Flex>
);

export const RoleCell = ({ value }: GenericCellProps) => {
  const { name } = value;

  return (
    <Flex alignItems="center" justifyContent="center">
      <Div display="inline-block" padding="4px 24px" borderRadius="90px" backgroundColor="#f1f5f8" color="#6d767d">
        <Span fontSize="0.8em" fontWeight={900}>{name}</Span>
      </Div>
    </Flex>
  );
};
