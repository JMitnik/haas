/* eslint-disable react/destructuring-assignment */
import * as UI from '@haas/ui';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { ConditionEntry } from 'views/AddAutomationView/CreateConditionModalCardTypes';
import { NodeCellContainer } from 'components/NodeCell/NodeCellTypes';

import { NodePickerHeader } from './NodePickerStyles';

export enum TargetTypeEnum {
  User = 'USER',
  Role = 'ROLE',
}

const DropdownOption = (props: any) => {
  const isUser = props.data?.type === TargetTypeEnum.User;
  return (
    <NodeCellContainer>
      <components.Option {...props}>
        <UI.Flex>
          <UI.Div>
            <UI.Text paddingRight={2}>
              {isUser && (
                <>
                  <UI.Span>User</UI.Span>
                  {' '}
                  <UI.Span color="#4A5568" fontWeight="bold">{props.data?.label}</UI.Span>
                  {' '}
                  <UI.Span>will be added as a target for this action </UI.Span>
                </>
              )}

              {!isUser && (
                <>
                  <UI.Span>All users with the role</UI.Span>
                  {' '}
                  <UI.Span color="#4A5568" fontWeight="bold">{props.data?.label}</UI.Span>
                  {' '}
                  <UI.Span>will be added as a target for this action</UI.Span>
                </>
              )}

            </UI.Text>
            <UI.Flex pt="0.5em">
              <UI.MicroLabel
                bg={isUser ? '#FE3274' : '#40A9FF'}
                color="white"
                mr="0.5em"
              >
                {props.data?.type}
              </UI.MicroLabel>
            </UI.Flex>
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
  isMulti?: boolean;
  currValues?: ConditionEntry[];
}

export const UserNodePicker = ({
  onChange,
  onClose,
  items,
  currValues,
  isMulti,
}: NodePickerProps) => {
  console.log('Items: ', items);
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
        <UI.ListHeader style={{ borderBottom: 0 }}>{t('users_and_roles')}</UI.ListHeader>
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
              // @ts-ignore
              isMulti={isMulti}
              menuIsOpen
              autoFocus
              options={filteredItems}
              defaultValue={currValues}
              isOptionDisabled={(e, selectedValues) => selectedValues.length >= 4}
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
