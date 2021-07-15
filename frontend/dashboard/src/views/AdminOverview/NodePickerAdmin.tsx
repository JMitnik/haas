import * as UI from '@haas/ui';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';
import { OptionProps } from 'react-select/src/types';
import { SystemPermission } from 'types/globalTypes';
import { GlobalPermissionList } from './GlobalPermissionList';
import { SystemPermissionTypeEnum } from './AdminOverviewTypes';

interface DropdownOptionProps extends OptionProps {
  label: string;
  data: {
    key: SystemPermission;
    value: SystemPermission;
    label: SystemPermission;
    domain: SystemPermissionTypeEnum;
  }
}

const DropdownOption = ({ data, label, ...props }: DropdownOptionProps) => {
  const nodeProps = GlobalPermissionList(data.key);

  const DropdownOption = (props: any) => {
    const nodeProps = GlobalPermissionList(props.data.key);
    // console.log(props)
    return (
      <NodeCellContainer>
        {/* @ts-ignore */}
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
                {label}
              </UI.Text>
              <UI.MicroLabel bg={nodeProps.bg} color={nodeProps.color !== 'transparent' ? nodeProps.color : nodeProps.stroke}>
                {data.domain}
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

  export const NodePickerAdmin = ({ onChange, onClose, items, SelectOptions }: any) => {
    const [filteredState, setFilteredState] = useState<SystemPermissionTypeEnum | null>(null);
    const [filteredItems, setFilteredItems] = useState(items);
    const { t } = useTranslation();

    useEffect(() => {
      console.log(filteredState);
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
        <UI.ListHeader>Permission List</UI.ListHeader>
        <UI.ListItem
          variant="gray"
          hasNoSelect
          width="115%"
        >
          <UI.Div width="115%">
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
                  isActive={filteredState === SystemPermissionTypeEnum.Create}
                  onClick={() => setFilteredState(SystemPermissionTypeEnum.Create)}
                >
                  Create
                </UI.SwitchItem>
                <UI.SwitchItem
                  isActive={filteredState === SystemPermissionTypeEnum.View}
                  onClick={() => setFilteredState(SystemPermissionTypeEnum.View)}
                >
                  View
                </UI.SwitchItem>
                <UI.SwitchItem
                  isActive={filteredState === SystemPermissionTypeEnum.Edit}
                  onClick={() => setFilteredState(SystemPermissionTypeEnum.Edit)}
                >
                  Edit
                </UI.SwitchItem>
                <UI.SwitchItem
                  isActive={filteredState === SystemPermissionTypeEnum.Delete}
                  onClick={() => setFilteredState(SystemPermissionTypeEnum.Delete)}
                >
                  Delete
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
                // @ts-ignore
                  Option: DropdownOption,
                  SingleValue: DropdownSingleValue,
                }}
                menuIsOpen
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
};

