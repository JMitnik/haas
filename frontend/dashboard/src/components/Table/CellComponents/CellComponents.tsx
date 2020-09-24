import { Div, Flex, Span, Text } from '@haas/ui';
import { User } from 'react-feather';
import React from 'react';

import { Badge, Icon } from '@chakra-ui/core';
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

export const RoleCell = ({ value }: GenericCellProps) => (
  <Div>
    {value && (
      <Badge variantColor="cyan">
        <Icon mr={1} as={User} />
        <Span>
          {value?.name}
        </Span>
      </Badge>
    )}
  </Div>
);
