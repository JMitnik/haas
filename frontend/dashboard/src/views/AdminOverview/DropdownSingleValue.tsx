import * as UI from '@haas/ui';
import React from 'react';

import { SystemPermission } from 'types/generated-types';

import { NodePickerAdmin } from './NodePickerAdmin';
import { OptionsOfPermissions } from './OptionsOfPermissions';

interface DropdownSingleValueProps {
  onClose?: () => void;
  globalPermissions?: SystemPermission[];
}

export const DropDownSingleValue = ({
  onClose,
  globalPermissions,
}: DropdownSingleValueProps) => {
  const options = globalPermissions?.map((globalPermission, index) => {
    const isEven = index % 2 === 0;
    // Style alternating rows
    const colorStyles = isEven
      ? { color: '#00B8D9', backgroundColor: '#FFF3E5' }
      : { backgroundColor: '#FFF3E5', color: '#FF8D00' };

    return {
      value: globalPermission,
      label: (
        <UI.Span style={colorStyles}>
          {globalPermission}
        </UI.Span>
      ),
    };
  });

  return (
    <>
      <UI.Div style={{ width: '345px' }}>
        <NodePickerAdmin
          items={OptionsOfPermissions}
          onClose={onClose}
          SelectOptions={options}
        />
      </UI.Div>
    </>
  );
};
