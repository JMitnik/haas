import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as Switch from 'components/Common/Switch';
import { ReactComponent as SendoutThumbnail } from 'assets/images/thumbnails/sm/sendout.svg';
import { useCreateDialogueScheduleMutation } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';

import { declareDialogueSchedule } from './AutomationOverview.helpers.tsx';

interface DialogueScheduleCardProps {
  dialogueSchedule: any;
  onOpenModalChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogueScheduleCard = ({ dialogueSchedule, onOpenModalChange }: DialogueScheduleCardProps) => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const [saveSchedule] = useCreateDialogueScheduleMutation({
    refetchQueries: ['automationConnection'],
  });

  return (
    <UI.Card>
      <UI.CardBody>
        <UI.Flex justifyContent="space-between" alignItems="center">
          <UI.Flex alignItems="center">
            <UI.Div maxWidth={50}>
              <UI.Thumbnail>
                <SendoutThumbnail />
              </UI.Thumbnail>
            </UI.Div>
            <UI.Div ml={4}>
              <UI.H4 fontSize="1.2rem" color="off.500" fontWeight={600}>
                {t('schedule_card_heading')}
              </UI.H4>
            </UI.Div>
          </UI.Flex>

          <UI.Div>
            {!!dialogueSchedule && (
              <Switch.Root
                onChange={() => saveSchedule({
                  variables: {
                    input: declareDialogueSchedule({
                      ...dialogueSchedule,
                      isEnabled: !dialogueSchedule.isEnabled,
                    }, activeCustomer?.id || ''),
                  },
                })}
                isChecked={dialogueSchedule.isEnabled as boolean}
              >
                <Switch.Thumb />
              </Switch.Root>
            )}
          </UI.Div>
        </UI.Flex>

        <UI.Div mt={2}>
          <UI.Text fontSize="1rem" color="off.500">
            {t('schedule_card_description')}
          </UI.Text>
        </UI.Div>

        {!dialogueSchedule ? (
          <UI.Button onClick={() => onOpenModalChange(true)} mt={4} size="sm">
            {t('get_started')}
          </UI.Button>
        ) : (
          <UI.Button onClick={() => onOpenModalChange(true)} mt={4} size="sm">
            {t('edit')}
          </UI.Button>
        )}
      </UI.CardBody>
    </UI.Card>
  );
};
