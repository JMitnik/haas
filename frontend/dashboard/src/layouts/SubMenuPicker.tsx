import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface NodePickerProps {
  onClose?: () => void;
}

export const SubMenuPicker = ({ onClose }: NodePickerProps) => {
  const { t } = useTranslation();

  return (
    <UI.List backgroundColor="white" maxWidth={300}>
      <UI.CloseButton onClose={onClose} />
      <UI.ListItem
        variant="gray"
        hasNoSelect
        width="100%"
      >
        <UI.Div width="100%">
          <UI.Div mb={2}>
            <UI.Text fontWeight="">Filter by type</UI.Text>
          </UI.Div>
        </UI.Div>
      </UI.ListItem>
    </UI.List>
  );
};
