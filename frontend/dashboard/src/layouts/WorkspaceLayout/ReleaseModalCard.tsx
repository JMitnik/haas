import * as UI from '@haas/ui';
import React, { useEffect, useState } from 'react';

import { UserTourFragmentFragment, useFinishTourOfUserMutation } from 'types/generated-types';
import { useTranslation } from 'react-i18next';

interface InteractionModalCardProps {
  userId: string;
  release?: UserTourFragmentFragment | null;
  onTourChange: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ReleaseModalCard = ({ userId, release, onTourChange }: InteractionModalCardProps) => {
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

  const goForward = () => {
    setStep((prevValue) => (prevValue + 1));
  };

  const goBack = () => {
    setStep((prevValue) => (prevValue - 1));
  };

  const finish = () => {
    onTourChange(undefined);
  };

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
      <UI.ModalBody display="flex" flexDirection="column" height="100%" flexGrow={1}>
        <UI.Div>{t(`${release?.triggerVersion}-title-${step}`)}</UI.Div>
        <UI.Div>{t(`${release?.triggerVersion}-helper-${step}`)}</UI.Div>
        <UI.Flex flexGrow={1}>
          <UI.Button onClick={finish}>Finish</UI.Button>
        </UI.Flex>

      </UI.ModalBody>
    </>
  );
};
