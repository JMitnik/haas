import * as UI from '@haas/ui';
import { BasePicker } from 'components/BasePicker';
import { OptionProps, SingleValueProps, components } from 'react-select';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface TopicPickerProps {
  items: any[];
  onChange: (item: any) => void;
  onClose: () => void;
}

interface DropdownOptionData {
  id: string;
  label: string;
}

interface TopickPickerSingleValueProps extends SingleValueProps<DropdownOptionData> {
  data: DropdownOptionData;
}

interface DropdownOptionProps extends OptionProps<DropdownOptionData, false> {
  data: DropdownOptionData;
}

const DropdownOption = ({ data, ...props }: DropdownOptionProps) => (
  <components.Option data={data} {...props}>
    <UI.Flex>
      <UI.Div>
        <UI.Text>
          {data.label}
        </UI.Text>
      </UI.Div>
    </UI.Flex>
  </components.Option>
);

const DropdownSingleValue = ({ data, ...props }: TopickPickerSingleValueProps) => (
  <components.SingleValue data={data} {...props}>
    <UI.Flex>
      <UI.Span color="gray.300">
        {data.label}
      </UI.Span>
    </UI.Flex>
  </components.SingleValue>
);

export const TopicPicker = ({ onChange, onClose, items }: TopicPickerProps) => {
  const { t } = useTranslation();

  return (
    <BasePicker
      heading={t('topic_values')}
      onClose={onClose}
      items={items}
      onChange={(changedTopic) => {
        onChange(changedTopic);
        onClose();
      }}
      optionComponent={DropdownOption}
      singleValueComponent={DropdownSingleValue}
    />
  );
};
