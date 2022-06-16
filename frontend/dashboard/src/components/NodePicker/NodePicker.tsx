/* eslint-disable react/destructuring-assignment */

import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import * as Modal from 'components/Common/Modal';
import {
  CreateCallToActionModalCard,
} from 'views/DialogueBuilderView/components/QuestionEntryForm/CreateCallToActionModalCard';
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
  // eslint-disable-next-line react/no-unused-prop-types
  questionId: string | number;
  onChange: (node: NodeSelect) => void;
  items: NodeSelect[];
  onModalOpen?: () => void;
  onModalClose?: () => void;
  onClose?: () => void;
}

export const NodePicker = ({ onChange, onClose, items, onModalOpen, onModalClose }: NodePickerProps) => {
  const [filteredState, setFilteredState] = useState<QuestionNodeTypeEnum | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { t } = useTranslation();
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

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
        <UI.ListHeader style={{ borderBottom: 0 }}>{t('call_to_action')}</UI.ListHeader>

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

      <Modal.Root open={createModalIsOpen} onClose={() => setCreateModalIsOpen(false)}>
        <CreateCallToActionModalCard
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(callToAction: any) => {
            handleChange(callToAction);
          }}
        />
      </Modal.Root>
    </UI.List>
  );
};
