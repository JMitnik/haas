import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';
import { QuestionNode, QuestionNodeTypeEnum } from 'types/generated-types';

import { NodePickerHeader } from './NodePickerStyles';

const DropdownOption = (props: any) => {
  const nodeProps = MapNodeToProperties(props.data.type);

  return (
    <NodeCellContainer>
      <components.Option {...props}>
        <UI.Flex>
          <UI.Icon
            bg={nodeProps.bg}
            color={nodeProps.color}
            height="2rem"
            width="2rem"
            stroke={nodeProps.stroke || undefined}
            style={{ flexShrink: 0 }}
            mr={3}
          >
            <nodeProps.icon />
          </UI.Icon>
          <UI.Div>
            <UI.Text>
              {props.label}
            </UI.Text>
            <UI.MicroLabel
              bg={nodeProps.bg}
              color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}
            >
              {props.data.type}
            </UI.MicroLabel>
          </UI.Div>
        </UI.Flex>
      </components.Option>
    </NodeCellContainer>
  );
};

const DropdownSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <UI.Flex>
      <UI.Span color="gray.300">
        {props?.data?.label}
      </UI.Span>
    </UI.Flex>
  </components.SingleValue>
);

interface NodeSelect extends Partial<QuestionNode> {
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
