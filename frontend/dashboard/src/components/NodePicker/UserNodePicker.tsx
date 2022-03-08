/* eslint-disable react/destructuring-assignment */
import * as UI from '@haas/ui';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { ConditionEntry } from 'views/AddAutomationView/CreateConditionModalCard';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';

import { NodePickerHeader } from './NodePickerStyles';

const DropdownOption = (props: any) => (
  <NodeCellContainer>
    <components.Option {...props}>
      <UI.Flex>
        <UI.Div>
          <UI.Text paddingRight={2}>
            <UI.Span color="#4A5568" fontWeight="bold">{props.data?.aggregate}</UI.Span>
          </UI.Text>
          <UI.Flex pt="0.5em">
            <UI.MicroLabel
              bg="#FE3274"
              color="white"
              mr="0.5em"
            >
              {props.data?.value}
            </UI.MicroLabel>
            <UI.MicroLabel
              bg="#40A9FF"
              color="white"
            >
              {props.data?.type}
            </UI.MicroLabel>
          </UI.Flex>
        </UI.Div>
      </UI.Flex>
    </components.Option>
  </NodeCellContainer>
);

const DropdownSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <UI.Flex>
      <UI.Span color="gray.300">
        {props?.data?.value}
      </UI.Span>
    </UI.Flex>
  </components.SingleValue>
);

interface UserEntry {
  type: string;
  value: string;
}

interface NodePickerProps {
  onChange: (node: ConditionEntry) => void;
  items: UserEntry[];
  onClose?: () => void;
}

enum TargetTypeEnum {
  User = 'USER',
  Role = 'ROLE',
}

export const UserNodePicker = ({
  onChange,
  onClose,
  items,
}: NodePickerProps) => {
  const [filteredState, setFilteredState] = useState<TargetTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { t } = useTranslation();

  useEffect(() => {
    if (!filteredState) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item: any) => item.type === filteredState));
    }
  }, [filteredState, setFilteredItems, items]);

  return (
    <UI.List maxWidth={300}>
      <UI.CloseButton onClose={onClose} />
      <NodePickerHeader>
        <UI.ListHeader style={{ borderBottom: 0 }}>{t('conditions')}</UI.ListHeader>
      </NodePickerHeader>

      <UI.ListItem
        variant="gray"
        hasNoSelect
        width="100%"
      >
        <UI.Div width="100%">
          <UI.Div mb={2}>
            <UI.Text fontWeight="">Filter by type</UI.Text>
            <UI.Switch>
              <UI.SwitchItem
                isActive={!filteredState}
                onClick={() => setFilteredState(null)}
              >
                {t('all')}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === TargetTypeEnum.User}
                onClick={() => setFilteredState(TargetTypeEnum.User)}
              >
                {t('user')}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === TargetTypeEnum.Role}
                onClick={() => setFilteredState(TargetTypeEnum.Role)}
              >
                {t('role')}
              </UI.SwitchItem>
            </UI.Switch>
          </UI.Div>
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
