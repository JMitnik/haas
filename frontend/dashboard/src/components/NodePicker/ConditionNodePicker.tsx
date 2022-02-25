/* eslint-disable react/destructuring-assignment */
import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { MapNodeToProperties } from 'components/MapNodeToProperties';
import { NodeCellContainer } from 'components/NodeCell/NodeCell';
import { QuestionNode, QuestionNodeTypeEnum } from 'types/generated-types';

import { ConditionEntry, CreateConditionModalCard } from 'views/AddAutomationView/CreateConditionModalCard';
import { NodePickerHeader } from './NodePickerStyles';

const DropdownOption = (props: any) => (
  <NodeCellContainer>
    <components.Option {...props}>
      <UI.Flex>
        <UI.Div>
          <UI.Text paddingRight={2}>
            <UI.Span color="#4A5568" fontWeight="bold">{props.data?.aggregate}</UI.Span>
            {' '}
            of option
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">{props.data?.questionOption}</UI.Span>
            {' '}
            in the last
            {' '}
            <UI.Span color="#4A5568" fontWeight="bold">{props.data?.latest}</UI.Span>
            {' '}
            entries
            {props.data.dateRange && (
              <UI.Span>
                {' '}
                between
                {' '}
                {props.data.dateRange?.[0]?.toString()}
                {' '}
                -
                {' '}
                {props.data.dateRange?.[1]?.toString()}
                {' '}

              </UI.Span>

            )}
            {' '}
            should be
          </UI.Text>
          <UI.Flex pt="0.5em">
            <UI.MicroLabel
              bg="#FE3274"
              color="white"
              mr="0.5em"
            >
              {props.data.scopeType}
            </UI.MicroLabel>
            <UI.MicroLabel
              bg="#40A9FF"
              color="white"
            >
              {props.data.aspect?.replaceAll('_', ' ')}
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
  items: ConditionEntry[];
  onModalOpen?: () => void;
  onModalClose?: () => void;
  onClose?: () => void;
  onAddCondition: React.Dispatch<React.SetStateAction<ConditionEntry[]>>;
}

export const ConditionNodePicker = ({ onChange,
  onClose, items, onModalOpen, onModalClose, onAddCondition }: NodePickerProps) => {
  const [filteredState, setFilteredState] = useState<QuestionNodeTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { t } = useTranslation();
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  console.log('ITEMS: ', items);

  const handleChange = (callToAction: QuestionNode) => {
    onChange({
      id: callToAction.id,
      type: callToAction.type,
      label: callToAction.title,
      value: callToAction.id,
    });
    setCreateModalIsOpen(false);
    onClose?.();
  };

  const handleOpenModal = () => {
    setCreateModalIsOpen(true);
  };

  useEffect(() => {
    if (createModalIsOpen) {
      onModalOpen?.();
    } else {
      onModalClose?.();
    }
  }, [createModalIsOpen]);

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

        <UI.Button
          leftIcon={Plus}
          variantColor="teal"
          ml={0}
          size="xs"
          onClick={() => handleOpenModal()}
        >
          {t('new')}
        </UI.Button>

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

      <UI.Modal willCloseOnOutsideClick={false} isOpen={createModalIsOpen} onClose={() => setCreateModalIsOpen(false)}>
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(condition: any) => {
            // TODO: Check if this works
            onAddCondition((oldConditions) => [...oldConditions, condition]);
            onChange(condition);
          }}
        />
      </UI.Modal>
    </UI.List>
  );
};
