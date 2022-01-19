import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import CTACard from 'views/ActionsOverview/CTACard';
import CTAForm from 'views/ActionsOverview/CTAForm';
import RegisterIcon from 'components/Icons/RegisterIcon';

interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (ctaId: string) => void;
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

export const NewCTAModalCard = ({ onClose, onSuccess }: NewCTAModalCardProps) => {
  const { t } = useTranslation();
  const [activeCTA, setActiveCTA] = useState<null | string>('active');
  const [newCTA, setNewCTA] = useState(true);
  const [ctaId, setCtaID] = useState<string>('');

  useEffect(() => {
    if (!newCTA) {
      onClose();
    }
  }, [newCTA]);

  useEffect(() => {
    if (!activeCTA) {
      onSuccess(ctaId);
    }
  }, [activeCTA]);

  return (
    <UI.ModalCard maxWidth={1200} onClose={onClose}>
      <UI.ModalHead>
        <UI.ModalTitle>
          Create new CTA
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <CTAForm
          onDeleteCTA={() => undefined}
          id="-1"
          onActiveCTAChange={setActiveCTA}
          title=""
          type={initializeCTAType('FORM')}
          links={[]}
          share={{ title: '', url: '', tooltip: '' }}
          onNewCTAChange={setNewCTA}
          form={{}}
          onCTAIdFetch={setCtaID}
        />
      </UI.ModalBody>
    </UI.ModalCard>
  );
};
