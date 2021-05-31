import * as UI from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import { ArrowRight, Mail, PenTool, Repeat, Send, Smartphone } from 'react-feather';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CampaignScheduleEnum, CampaignVariantEnum } from 'types/generated-types';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/core'

import { ReactComponent as SlackIcon } from 'assets/icons/icon-slack.svg';

import * as LS from './CampaignBuilderStyles';
import { VariantType } from './CampaignBuilderTypes';
import { useEffect } from 'react';

const SlackIconContainer = () => (
  <UI.Icon width="20px" mr={2}>
    <SlackIcon>

    </SlackIcon>
  </UI.Icon>
)

type FollowUpMetric = 'days' | 'hours';

interface CampaignVariantFormProps {
  variantIndex: number;
  variant: VariantType;
  onChange: any;
}

export const CampaignVariantForm = ({ variant, onChange, variantIndex }: CampaignVariantFormProps) => {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      body: variant.body,
      type: variant.type,
      scheduleType: variant.scheduleType,
      followUpMetric: 'days',
      followUpAmount: 0,
      repeatMetric: 'days',
      repeatAmount: 0,
    }
  });

  const formValues = form.watch();

  const percentageFull = Math.min(Math.floor(((variant?.body?.length || 160) / 160) * 100), 100);

  const scheduleType: CampaignScheduleEnum = form.watch('scheduleType');

  return (
    <UI.Form>
      <UI.Stack spacing={4}>
        <LS.BuilderEditCard>
          <UI.Flex mb={2} alignItems="center">
            <UI.Icon color="gray.500" mr={1}>
              <ArrowRight width="16px"/>
            </UI.Icon>
            <UI.Helper>
              Campaign step
            </UI.Helper>
          </UI.Flex>
          <UI.FormControl isRequired>
            <UI.FormLabel>Step type</UI.FormLabel>
            <Controller
              control={form.control}
              defaultValue={variant.scheduleType}
              name="scheduleType"
              render={({ onChange, value, onBlur }) => (
                <UI.RadioButtons
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                >
                  <UI.RadioButton value={CampaignScheduleEnum.General} text={t('campaign_general')} description={t('campaign_general_helper')} />
                  <UI.RadioButton icon={ArrowRight} value={CampaignScheduleEnum.FollowUp} text={t('follow_up')} description={t('campaign_follow_up_helper')} />
                  <UI.RadioButton mt={2} icon={Repeat} value={CampaignScheduleEnum.Recurring} text={t('recurring')} description={t('campaign_recurring_helper')} />
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
                  <UI.Input name="followUpAmount" variant="outline" placeholder="7" />
                </UI.Div>
                <UI.Div>

                <Controller
                  control={form.control}
                  name="followUpMetric"
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
                  <UI.Input name="repeatAmount" variant="outline" placeholder="7" />
                </UI.Div>
                <UI.Div>

                <Controller
                  control={form.control}
                  name="repeatMetric"
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
              <Send width="16px"/>
            </UI.Icon>
            <UI.Helper>
              Delivery method
            </UI.Helper>
          </UI.Flex>
          <UI.FormControl isRequired>
            <Controller
              control={form.control}
              defaultValue={variant.type}
              name="type"
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
          {formValues.type === 'SMS' && (
              <UI.Div mb={2} style={{ top: 12 ,right: 12 , position: 'absolute' }}>
                <UI.ColumnFlex alignItems="flex-end">
                  <CircularProgress
                    mt={2} color={(variant?.body?.length || 160) <= 160 ? 'green' : 'red'} value={percentageFull}>
                    <CircularProgressLabel>{variant?.body?.length}</CircularProgressLabel>
                  </CircularProgress>
                </UI.ColumnFlex>
              </UI.Div>
            )}
          <UI.Flex mb={2} alignItems="center">
            <UI.Icon color="gray.500" mr={1}>
              <PenTool width="16px"/>
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
            defaultValue={variant.body}
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