import * as UI from '@haas/ui';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';

import * as RadioGroup from 'components/Common/RadioGroup';
import { AutomationActionType } from 'types/generated-types';

import { ACTION_OPTIONS } from './AutomationForm.constants';
import { getCronByActionType, getTypeByActionType } from './AutomationForm.helpers';

interface ScheduledAutomationActionFragmentProps {
  dialogueItems: {
    id: string;
    value: string;
    label: string;
    type: string;
  }[]
}

export const ScheduledAutomationActionFragment = ({ dialogueItems }: ScheduledAutomationActionFragmentProps) => {
  const { t } = useTranslation();
  const form = useFormContext();

  const schedule = useWatch({
    name: 'schedule',
    control: form.control,
  });

  return (

    <>
      <input type="hidden" {...form.register(`actions.${0}.action.id`)} />
      <input type="hidden" {...form.register(`actions.${0}.action.channelId`)} />
      <UI.FormControl>
        <UI.FormLabel htmlFor="actionType">{t('automation:action_type')}</UI.FormLabel>
        <UI.InputHelper>{t('automation:action_type_helper')}</UI.InputHelper>
        <Controller
          name={`actions.${0}.action.type`}
          control={form.control}
          render={({ field: { value, onChange, onBlur } }) => (
            <RadioGroup.Root
              defaultValue={value}
              onBlur={onBlur}
              variant="spaced"
              onValueChange={(e) => {
                const cron = getCronByActionType(e as AutomationActionType);
                form.setValue('schedule', {
                  ...cron,
                  activeDialogue: schedule?.activeDialogue as any,
                  type: getTypeByActionType(e as AutomationActionType),
                });
                return onChange(e);
              }}
            >
              {ACTION_OPTIONS.map((option) => (
                <RadioGroup.Item
                  isActive={value === option.value}
                  value={option.value}
                  key={option.value}
                  contentVariant="twoLine"
                  variant="boxed"
                >
                  <RadioGroup.Label>
                    {option.label}
                  </RadioGroup.Label>
                  <RadioGroup.Subtitle>
                    {option.description}
                  </RadioGroup.Subtitle>
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          )}
        />
      </UI.FormControl>
      {/* <UI.FormControl isRequired isInvalid={!!form.formState.errors.schedule?.activeDialogue}>
        <UI.FormLabel htmlFor="activeDialogue">
          {t('dialogue')}
        </UI.FormLabel>
        <UI.InputHelper>
          {t('automation:dialogue_helper_DIALOGUE')}
        </UI.InputHelper>
        <UI.Div>
          <UI.Flex>
            <UI.Div
              width="100%"
              backgroundColor="#fbfcff"
              border="1px solid #edf2f7"
              borderRadius="10px"
              padding={4}
            >
              <>
                <UI.Grid gridTemplateColumns="2fr 1fr">
                  <UI.Helper>{t('dialogue')}</UI.Helper>
                </UI.Grid>

                <UI.Grid
                  pt={2}
                  pb={2}
                  pl={0}
                  pr={0}
                  borderBottom="1px solid #edf2f7"
                  gridTemplateColumns="1fr"
                >
                  <UI.Div alignItems="center" display="flex">
                    <Controller
                      name="schedule.activeDialogue"
                      control={form.control}
                      render={({ field: { value, onChange } }) => (
                        <Dropdown
                          isRelative
                          renderOverlay={({ onClose: onDialoguePickerClose }) => (
                            <DialogueNodePicker
                              // Handle items (in this case dialogues)
                              items={dialogueItems}
                              onClose={onDialoguePickerClose}
                              onChange={onChange}
                            />
                          )}
                        >
                          {({ onOpen }) => (
                            <UI.Div
                              width="100%"
                              justifyContent="center"
                              display="flex"
                              alignItems="center"
                            >
                              {(value as any)?.label ? (
                                <NodeCell onRemove={() => onChange(null)} onClick={onOpen} node={value} />
                              ) : (
                                <UI.Button
                                  size="sm"
                                  variant="outline"
                                  onClick={onOpen}
                                  variantColor="altGray"
                                >
                                  <UI.Icon mr={1}>
                                    <PlusCircle />
                                  </UI.Icon>
                                  {t('add_dialogue')}
                                </UI.Button>
                              )}
                            </UI.Div>
                          )}
                        </Dropdown>
                      )}
                    />
                  </UI.Div>
                </UI.Grid>
              </>
            </UI.Div>
          </UI.Flex>
        </UI.Div>
      </UI.FormControl> */}
    </>
  );
};
