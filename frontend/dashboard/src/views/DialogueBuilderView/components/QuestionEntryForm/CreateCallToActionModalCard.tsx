import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import CTAForm from 'views/ActionsOverview/CTAForm';

interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (data?: any) => void;
}

const initializeCTAType = (type: string) => {
  if (type === 'TEXTBOX') {
    return { label: 'Opinion', value: 'TEXTBOX' };
  }

  if (type === 'REGISTER') {
    return { label: 'Register', value: 'REGISTRATION' };
  }

  if (type === 'LINK') {
    return { label: 'Link', value: 'LINK' };
  }

  if (type === 'SHARE') {
    return { label: 'Share', value: 'SHARE' };
  }

  if (type === 'FORM') {
    return { label: 'Form', value: 'FORM' };
  }

  return { label: 'None', value: '' };
};

export const CreateCallToActionModalCard = ({ onClose, onSuccess }: NewCTAModalCardProps) => {
  const { t } = useTranslation();

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.DeprecatedModalHead>
        <UI.ModalTitle>
          Create new CTA
        </UI.ModalTitle>
      </UI.DeprecatedModalHead>
      <UI.DeprecatedModalBody>
        <CTAForm
          onCancel={() => onClose()}
          onDeleteCTA={() => undefined}
          id="-1"
          title=""
          type={initializeCTAType('FORM')}
          links={[]}
          share={{ title: '', url: '', tooltip: '' }}
          onSuccess={(data) => onSuccess(data)}
          onNewCTAChange={() => { }}
          form={{}}
        />
      </UI.DeprecatedModalBody>
    </UI.ModalCard>
  );
};
