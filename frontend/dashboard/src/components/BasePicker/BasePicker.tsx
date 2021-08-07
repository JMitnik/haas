import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface BasePickerProps {
  items: any[];
  onChange: (item: any) => void;
  optionComponent: React.ReactNode;
  singleValueComponent: React.ReactNode;
  onClose?: () => void;
  heading?: string;
}

/**
 * A picker is shown in a dropdown as a selection of items that can be grouped, filtered by, and selected.
 *
 * - Includes header at the start.
 */
export const BasePicker = ({
  onClose,
  heading,
  items,
  onChange,
  optionComponent,
  singleValueComponent,
}: BasePickerProps) => {
  const { t } = useTranslation();

  return (
    <UI.List maxWidth={300}>
      <UI.CloseButton onClose={onClose} />
      <UI.ListHeader>{heading}</UI.ListHeader>
      <UI.ListItem
        variant="gray"
        hasNoSelect
        width="100%"
      >
        <UI.Div width="100%">
          {/* <UI.Div mb={2}>
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
          </UI.Div> */}
          <UI.Div>
            <UI.Text>{t('search')}</UI.Text>
            <UI.Select
              menuIsOpen
              autoFocus
              options={items}
              onChange={onChange}
              components={{
                // @ts-ignore
                Option: optionComponent,
                // @ts-ignore
                SingleValue: singleValueComponent,
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
