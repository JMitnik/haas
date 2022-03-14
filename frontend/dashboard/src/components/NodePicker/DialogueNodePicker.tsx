import * as UI from '@haas/ui';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { Dialogue } from 'types/generated-types';
import { NodeCellContainer } from 'components/NodeCell/NodeCellTypes';

import { NodePickerHeader } from './NodePickerStyles';

const DropdownOption = (props: any) => (
  <NodeCellContainer>
    <components.Option {...props}>
      <UI.Flex alignItems="center">
        <UI.Div
          display="flex"
          justifyContent="center"
          bg="#F7C948"
          color="white"
          padding="0.4em 0.8em"
          mr={3}
          borderRadius="10px"
        >
          <UI.Span fontWeight="bold">D</UI.Span>
        </UI.Div>
        <UI.Div>
          <UI.Text>
            {props.label}
          </UI.Text>
        </UI.Div>
      </UI.Flex>
    </components.Option>
  </NodeCellContainer>
);

const DropdownSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <UI.Flex>
      <UI.Span color="gray.300">
        {props?.data?.label}
      </UI.Span>
    </UI.Flex>
  </components.SingleValue>
);

interface NodeSelect extends Partial<Dialogue> {
  label: string;
  value: string;
}

interface NodePickerProps {
  onChange: (node: NodeSelect) => void;
  items: NodeSelect[];
  onClose?: () => void;
}

export const DialogueNodePicker = ({ onChange, onClose, items }: NodePickerProps) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const { t } = useTranslation();

  useEffect(() => {
    setFilteredItems(items);
  }, [setFilteredItems, items]);

  return (
    <UI.List maxWidth={300}>
      <UI.CloseButton onClose={onClose} />
      <NodePickerHeader>
        <UI.ListHeader style={{ borderBottom: 0 }}>{t('dialogue')}</UI.ListHeader>
      </NodePickerHeader>

      <UI.ListItem
        variant="gray"
        hasNoSelect
        width="100%"
      >
        <UI.Div width="100%">

          <UI.Div>
            <UI.Text>{t('search')}</UI.Text>
            <UI.Select
              menuIsOpen
              autoFocus
              options={filteredItems}
              onChange={onChange}
              components={{
                Option: DropdownOption,
                SingleValue: DropdownSingleValue,
              }}
              classNamePrefix="select"
              styles={{
                menu: () => ({
                  marginTop: 0,
                }),
                control: (provided) => ({
                  ...provided,
                  borderWidth: 1,
                }),
              }}
            />
          </UI.Div>
        </UI.Div>
      </UI.ListItem>
    </UI.List>
  );
};
