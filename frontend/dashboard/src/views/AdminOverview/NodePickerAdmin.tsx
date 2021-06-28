import * as UI from '@haas/ui';
import React, { useState, useEffect } from "react";
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';

import { SystemPermissionTypeEnum } from 'types/generated-types';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';
import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { SystemPermission } from 'types/globalTypes';

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
            <UI.MicroLabel bg={nodeProps.bg} color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}>
              {props.data.type}
            </UI.MicroLabel>
          </UI.Div>
        </UI.Flex>
      </components.Option>
    </NodeCellContainer>
  );
};

const DropdownSingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <UI.Flex>
        <UI.Span color="gray.300">
          {props?.data?.label}
        </UI.Span>
      </UI.Flex>
    </components.SingleValue>
  )
};

export const NodePickerAdmin = ({ onChange, onClose, items, SelectOptions }: any) => {
  const [filteredState, setFilteredState] = useState<SystemPermissionTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { t } = useTranslation();
  
  useEffect(() => {
    console.log(filteredState)
    if (!filteredState) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item: any) => item.domain === filteredState));
    //   setFilteredItems(
    //       items.map((its : any)=>(
    //           its.filter((it: any) => it.domain === filteredState)
    //       ))
    //   )
    }
  }, [filteredState, setFilteredItems, items]);

  return (
    <UI.List maxWidth={300}>
      <UI.CloseButton onClose={onClose} />
      <UI.ListHeader>{"Permission List"}</UI.ListHeader>
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
                onClick={() => setFilteredState(null)}>
                {t('all')}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === SystemPermissionTypeEnum.Create}
                onClick={() => setFilteredState(SystemPermissionTypeEnum.Create)}
              >
                {'Create'}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === SystemPermissionTypeEnum.View}
                onClick={() => setFilteredState(SystemPermissionTypeEnum.View)}
              >
                {'View'}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === SystemPermissionTypeEnum.Edit}
                onClick={() => setFilteredState(SystemPermissionTypeEnum.Edit)}
              >
                {'Edit'}
              </UI.SwitchItem>
               <UI.SwitchItem
                isActive={filteredState === SystemPermissionTypeEnum.Delete}
                onClick={() => setFilteredState(SystemPermissionTypeEnum.Delete)}
              >
                {'Delete'}
              </UI.SwitchItem>
            </UI.Switch>
          </UI.Div>
          <UI.Div>
            <UI.Text>{t('search')}</UI.Text>
            <UI.Select
              isMulti
              defaultValue={SelectOptions}
              autoFocus
              options={filteredItems}
              onChange={onChange}
              components={{
                Option: DropdownOption,
                SingleValue: DropdownSingleValue,
              }}
              menuIsOpen
              classNamePrefix="select"
              styles={{
                menu: () => ({
                  marginTop: 0
                }),
                control: (provided) => ({
                  ...provided,
                  borderWidth: 1,
                })
              }}
            />
          </UI.Div>
        </UI.Div>
      </UI.ListItem>
    </UI.List>
  )
};

