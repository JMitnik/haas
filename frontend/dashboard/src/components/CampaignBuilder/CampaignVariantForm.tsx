import * as UI from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import { ArrowRight, Mail, PenTool, Repeat, Send, Smartphone } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CampaignScheduleEnum, CampaignVariantEdgeConditionEnumType, CampaignVariantEdgeType, CampaignVariantEnum } from 'types/generated-types';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/core'

import { ReactComponent as SlackIcon } from 'assets/icons/icon-slack.svg';

import * as LS from './CampaignBuilderStyles';
import { VariantEdgeType, VariantType } from './CampaignBuilderTypes';
import { useEffect } from 'react';
import useDebounce from 'hooks/useDebounce';
import getCustomersOfUser from 'queries/getCustomersOfUser';

const SlackIconContainer = () => (
  <UI.Icon width="20px" mr={2}>
    <SlackIcon>

    </SlackIcon>
  </UI.Icon>
)

type FollowUpMetric = 'days' | 'hours';

interface CampaignVariantFormProps {
  variantEdgeIndex: string;
  variantEdge: VariantEdgeType;
  onChange: any;
  pariantVariantEdgeIndex?: string;
  parentVariant?: VariantType;
}

export const CampaignVariantForm = ({ variantEdge, pariantVariantEdgeIndex, onChange, variantEdgeIndex, parentVariant }: CampaignVariantFormProps) => {
  const { t } = useTranslation();
  const form = useForm({
    shouldUnregister: true,
    defaultValues: {
      edge: {
        condition: CampaignVariantEdgeConditionEnumType.OnNotFinished,
        followUpMetric: 'days',
        followUpAmount: 0,
        repeatMetric: 'days',
        repeatAmount: 0,
      },
      variant: {
        label: variantEdge?.childVariant?.label,
        body: variantEdge?.childVariant?.body,
        type: variantEdge?.childVariant?.type,
        scheduleType: variantEdge?.childVariant?.scheduleType,
      }
    }
  });

  const { variant: { label , type, scheduleType }, edge: { condition } = {} } = form.watch();
  const debouncedLabel = useDebounce(label || '', 300);
  const debouncedScheduleType = useDebounce(scheduleType || CampaignScheduleEnum.General, 300);
  const debouncedType = useDebounce(type || CampaignVariantEnum.Email, 300);

  useEffect(() => {
    onChange({
      label: debouncedLabel,
      scheduleType: debouncedScheduleType,
      type: debouncedType
    }, variantEdgeIndex, pariantVariantEdgeIndex);
  }, [debouncedLabel, debouncedScheduleType, debouncedType]);

  const percentageFull = Math.min(Math.floor(((variantEdge?.childVariant?.body?.length || 160) / 160) * 100), 100);

  return (
    <UI.Form>
      <UI.Stack spacing={4}>
        <LS.BuilderEditCard>
          <UI.Flex mb={2} alignItems="center">
            <UI.Icon color="gray.500" mr={1}>
              <ArrowRight width="16px" />
            </UI.Icon>
            <UI.Helper>
              Campaign step
            </UI.Helper>
          </UI.Flex>
          <UI.FormControl isRequired>
            <UI.FormLabel>Label</UI.FormLabel>
            <UI.Input name="variant.label" ref={form.register()} defaultValue={variantEdge?.childVariant?.label || ''} />
          </UI.FormControl>

          <UI.FormControl isRequired>
            <UI.FormLabel>Step type</UI.FormLabel>
            <Controller
              control={form.control}
              defaultValue={variantEdge?.childVariant?.scheduleType}
              name="variant.scheduleType"
              render={({ onChange, value, onBlur }) => (
                <UI.RadioButtons
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  <UI.RadioButton
                    value={CampaignScheduleEnum.General}
                    text={t('campaign_general')}
                    description={t('campaign_general_helper')}
                  />
                  <UI.RadioButton
                    icon={ArrowRight}
                    value={CampaignScheduleEnum.FollowUp}
                    text={t('follow_up')}
                    description={t('campaign_follow_up_helper')}
                  />
                  <UI.RadioButton
                    mt={2}
                    icon={Repeat}
                    value={CampaignScheduleEnum.Recurring}
                    isDisabled={!!variantEdge?.childVariant?.children?.length}
                    text={t('recurring')}
                    description={t('campaign_recurring_helper')}
                  />
                </UI.RadioButtons>
              )}
            />
          </UI.FormControl>

          {scheduleType === CampaignScheduleEnum.FollowUp && (
            <UI.FormControl isRequired mt={2}>
              <UI.FormLabel>Follow-up after</UI.FormLabel>
              <UI.Div>

              </UI.Div>
              <LS.BuilderInputRadioGroup>
                <UI.Div>
                  <UI.Input name="edge.followUpAmount" variant="outline" placeholder="7" />
                </UI.Div>
                <UI.Div>

                  <Controller
                    control={form.control}
                    name="edge.followUpMetric"
                    render={({ onChange, value, onBlur }) => (
                      <UI.RadioButtons
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      >
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="days" text="Days" />
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="hours" text="Hours" />
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="weeks" text="Weeks" />
                      </UI.RadioButtons>
                    )}
                  />
                </UI.Div>
              </LS.BuilderInputRadioGroup>
            </UI.FormControl>
          )}

          {scheduleType === CampaignScheduleEnum.Recurring && (
            <UI.FormControl isRequired mt={2}>
              <UI.FormLabel>Repeat every</UI.FormLabel>
              <UI.Div>

              </UI.Div>
              <LS.BuilderInputRadioGroup>
                <UI.Div>
                  <UI.Input name="edge.repeatAmount" variant="outline" placeholder="7" />
                </UI.Div>
                <UI.Div>

                  <Controller
                    control={form.control}
                    name="edge.repeatMetric"
                    render={({ onChange, value, onBlur }) => (
                      <UI.RadioButtons
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      >
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="days" text="Days" />
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="hours" text="Hours" />
                        <UI.RadioButton fontSize="0.7rem" size="xs" value="weeks" text="Weeks" />
                      </UI.RadioButtons>
                    )}
                  />
                </UI.Div>
              </LS.BuilderInputRadioGroup>
            </UI.FormControl>
          )}
        </LS.BuilderEditCard>
        <LS.BuilderEditCard>
          <UI.Flex mb={2} alignItems="center">
            <UI.Icon color="gray.500" mr={1}>
              <Send width="16px" />
            </UI.Icon>
            <UI.Helper>
              Delivery method
            </UI.Helper>
          </UI.Flex>
          <UI.FormControl isRequired>
            <Controller
              control={form.control}
              defaultValue={variantEdge?.childVariant?.type}
              name="variant.type"
              render={({ onChange, value, onBlur }) => (
                <UI.RadioButtons
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  <UI.RadioButton icon={Mail} value={CampaignVariantEnum.Email} text={t('email')} description={t('campaign_email_helper')} />
                  <UI.RadioButton icon={Smartphone} value="SMS" text={t('sms')} description={t('campaign_sms_helper')} />
                  <UI.RadioButton isDisabled mt={2} icon={SlackIconContainer} value="Slack" text={t('slack')} description={t('campaign_slack_helper')} />
                </UI.RadioButtons>
              )}
            />
          </UI.FormControl>
        </LS.BuilderEditCard>
        <LS.BuilderEditCard>
          {type === 'SMS' && (
            <UI.Div mb={2} style={{ top: 12, right: 12, position: 'absolute' }}>
              <UI.ColumnFlex alignItems="flex-end">
                <CircularProgress
                  mt={2} color={(variantEdge?.childVariant?.body?.length || 160) <= 160 ? 'green' : 'red'} value={percentageFull}>
                  <CircularProgressLabel>{variantEdge?.childVariant?.body?.length}</CircularProgressLabel>
                </CircularProgress>
              </UI.ColumnFlex>
            </UI.Div>
          )}
          <UI.Flex mb={2} alignItems="center">
            <UI.Icon color="gray.500" mr={1}>
              <PenTool width="16px" />
            </UI.Icon>
            <UI.Helper>
              Content
            </UI.Helper>
          </UI.Flex>
          <UI.FormControl isRequired>
            <UI.FormLabel>Message body</UI.FormLabel>
            <Controller
              name={`body`}
              id={`body`}
              control={form.control}
              defaultValue={variantEdge?.childVariant?.body}
              render={({ value, onChange }) => (
                <UI.MarkdownEditor
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </UI.FormControl>
        </LS.BuilderEditCard>


      </UI.Stack>
    </UI.Form>
  )
}
