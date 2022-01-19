import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';
import { QuestionNodeTypeEnum } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

import { NewCTAButton } from './NodePickerStyles';

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

export const NodePicker = ({ onChange, onClose, items, questionId }: any) => {
  const [filteredState, setFilteredState] = useState<QuestionNodeTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { goToNewBuilderCTAView } = useNavigator();
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
      <UI.Flex alignItems="baseline">
        <UI.ListHeader>{t('call_to_action')}</UI.ListHeader>
        <UI.Button
          leftIcon={Plus}
          variantColor="teal"
          ml={0}
          size="xs"
          onClick={() => goToNewBuilderCTAView(questionId)}
        >
          New
        </UI.Button>
      </UI.Flex>

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
                isActive={filteredState === QuestionNodeTypeEnum.Link}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Link)}
              >
                {t('link')}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === QuestionNodeTypeEnum.Share}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Share)}
              >
                {t('share')}
              </UI.SwitchItem>
              <UI.SwitchItem
                isActive={filteredState === QuestionNodeTypeEnum.Form}
                onClick={() => setFilteredState(QuestionNodeTypeEnum.Form)}
              >
                {t('form')}
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
