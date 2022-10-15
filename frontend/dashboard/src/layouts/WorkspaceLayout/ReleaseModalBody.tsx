import * as UI from '@haas/ui';
import React, { useEffect, useState } from 'react';

import { UserTourFragmentFragment, useFinishTourOfUserMutation } from 'types/generated-types';
import { useTranslation } from 'react-i18next';

interface InteractionModalCardProps {
  userId: string;
  release?: UserTourFragmentFragment | null;
  onTourChange: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ReleaseModalBody = ({ userId, release, onTourChange }: InteractionModalCardProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [finishTour] = useFinishTourOfUserMutation();

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
      <UI.Div height={400}>
        <UI.ColumnFlex height="100%">
          <UI.ModalBody maxWidth={600} flex="100%">
            <UI.Div>{t(`${release?.steps?.[step]?.titleKey}`)}</UI.Div>
            <UI.Div>{t(`${release?.steps?.[step]?.helperKey}`)}</UI.Div>
          </UI.ModalBody>
          <UI.ModalFooter>
            <UI.Grid gridTemplateColumns="1fr 1fr">
              <UI.Div>
                {step > 0 && (
                  <UI.Button onClick={goBack} width="100%" size="md" variant="outline" variantColor="off">
                    Previous
                  </UI.Button>
                )}
              </UI.Div>
              <UI.Div>
                {release?.steps?.length && step !== release?.steps?.length - 1 ? (
                  <UI.Button
                    type="submit"
                    width="100%"
                    size="md"
                    onClick={goForward}
                  >
                    Next
                  </UI.Button>
                ) : (
                  <UI.Button
                    type="submit"
                    width="100%"
                    size="md"
                    onClick={finish}
                  >
                    Finish
                  </UI.Button>
                )}

              </UI.Div>
            </UI.Grid>
          </UI.ModalFooter>
        </UI.ColumnFlex>
      </UI.Div>
    </>
  );
};
