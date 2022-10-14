import * as UI from '@haas/ui';
import React, { useEffect, useState } from 'react';

import { UserTourFragmentFragment, useFinishTourOfUserMutation } from 'types/generated-types';
import { useTranslation } from 'react-i18next';

interface InteractionModalCardProps {
  userId: string;
  release?: UserTourFragmentFragment | null;
}

export const ReleaseModalCard = ({ userId, release }: InteractionModalCardProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [finishTour] = useFinishTourOfUserMutation({
    onCompleted: (data) => {
      console.log('Finished tour data: ', data?.finishTourOfUser);
    },
  });

  useEffect(() => {
    if (release?.id) {
      finishTour({
        variables: {
          input: {
            userId,
            userTourId: release?.id,
          },
        },
      });
    }
  }, [finishTour, release]);

  console.log('Release: ', release);

  return (
    <>
      <UI.ModalHead>
        <UI.ModalTitle>
          {t('new_release')}
          {' '}
          :
          {' '}
          {release?.triggerVersion}
        </UI.ModalTitle>
      </UI.ModalHead>
      <UI.ModalBody>
        <UI.Div>{t(`${release?.triggerVersion}-title-${step}`)}</UI.Div>
        <UI.Div>{t(`${release?.triggerVersion}-helper-${step}`)}</UI.Div>
      </UI.ModalBody>
    </>
  );
};
