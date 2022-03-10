import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';

import { CircularProgress, CircularProgressLabel, useToast } from '@chakra-ui/core';
import { ReactComponent as DecideIll } from 'assets/images/undraw_decide.svg';
import { Mail, Smartphone } from 'react-feather';
import { useCustomer } from 'providers/CustomerProvider';
import Select from 'react-select';

import {
  CampaignVariantEnum,
  refetchGetWorkspaceCampaignsQuery,
  useCreateCampaignMutation,
  useGetWorkspaceDialoguesQuery,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

type InputEvent = React.FormEvent<HTMLInputElement>;

const createCampaignBodyPlaceholder = `Dear {{firstName}},
thank you for subscribing to {{dialogueId}}!
Please visit {{dialogueUrl}}.`;

const SMS_LIMIT_CHARACTERS = 160;
const MAX_SMS_FROM_CHARACTERS = 11;

const mapVariantIndexToLabel: { [key: number]: string } = {
  0: 'A',
  1: 'B',
};

const variantSchema = yup.object({
  label: yup.string().required(),
  type: yup.mixed().oneOf(['EMAIL', 'SMS']).required(),
  from: yup.string().when('type', {
    is: (ctaType) => ctaType === 'SMS',
    // @ts-ignore
    // FIXME:  yup.string(...).max(...).noWhitespace is not a function. Had to remove noWhitespace()
    then: yup.string().max(MAX_SMS_FROM_CHARACTERS),
    otherwise: yup.string().notRequired(),
  }),
  dialogue: yup.object({
    label: yup.string(),
    value: yup.string(),
  }).required(),
  body: yup.string().when('type', {
    is: (ctaType) => ctaType === 'SMS',
    then: yup.string().max(SMS_LIMIT_CHARACTERS).required(),
    otherwise: yup.string().required(),
  }).required(),
  weight: yup.number().required(),
}).required();

const schema = yup.object({
  label: yup.string().required(),
  variants: yup.array().of(variantSchema),
  customVariables: yup.array().of(yup.object({
    key: yup.string(),
  })),
}).required();

export type CampaignFormProps = yup.InferType<typeof schema>;
type VariantFormProps = yup.InferType<typeof variantSchema>;

interface ActiveVariantFormProps {
  form: any;
  activeVariantIndex: number;
  isReadOnly?: boolean;
  variant: any;
}

const ActiveVariantForm = ({ form, activeVariantIndex, variant, isReadOnly }: ActiveVariantFormProps) => {
  const activeVariant = form.watch(`variants.${activeVariantIndex}`) as VariantFormProps;
  const { t } = useTranslation();

  const { customerSlug } = useNavigator();

  const { data } = useGetWorkspaceDialoguesQuery({
    variables: {
      customerSlug,
    },
    fetchPolicy: 'cache-and-network',
  });

  const dialogues = data?.customer?.dialogues?.map((dialogue) => ({
    label: dialogue.title,
    value: dialogue.id,
  })) || [];

  const percentageFull = Math.min(Math.floor((activeVariant.body.length / SMS_LIMIT_CHARACTERS) * 100), 100);

  return (
    <UI.CardBody id="subForm">
      <UI.Div mb={2} borderBottom="1px solid #fff" borderColor="gray.300" pb={2}>
        <UI.Text fontWeight={700} color="gray.500" fontSize="0.9rem">
          {`${t('edit_variant')} ${mapVariantIndexToLabel[activeVariantIndex]}`}
        </UI.Text>
      </UI.Div>

      <UI.InputGrid>
        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor={`variants[${activeVariantIndex}].label`}>{t('variant_label')}</UI.FormLabel>
          <UI.Input
            key={variant.variantIndex}
            defaultValue={activeVariant?.label}
            id={`variants[${activeVariantIndex}].label`}
            isDisabled={isReadOnly}
            {...form.register(`variants.${activeVariantIndex}.label`)}
          />
        </UI.FormControl>

        <UI.FormControl>
          <UI.FormLabel htmlFor={`variants.${activeVariantIndex}.from`}>{t('from')}</UI.FormLabel>
          <UI.Input
            key={variant.variantIndex}
            defaultValue={activeVariant?.from}
            placeholder={activeVariant.type === 'SMS' ? 'HAAS' : 'noreply@haas.live'}
            id={`variants[${activeVariantIndex}].from`}
            {...form.register(`variants.${activeVariantIndex}.from`)}
            isDisabled={isReadOnly}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor={`variants.${activeVariantIndex}.dialogue`}>{t('dialogue')}</UI.FormLabel>
          <Controller
            name={`variants[${activeVariantIndex}].dialogue`}
            key={variant.variantIndex}
            control={form.control}
            defaultValue={activeVariant.dialogue || null}
            render={({ field }) => (
              <Select
                placeholder="Select a dialogue"
                isDisabled={isReadOnly}
                id={`variants.${activeVariantIndex}.dialogue`}
                classNamePrefix="select"
                className="select"
                defaultOptions
                options={dialogues}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel>{t('distribution')}</UI.FormLabel>
          <Controller
            key={variant.variantIndex}
            control={form.control}
            defaultValue={activeVariant.type}
            name={`variants.${activeVariantIndex}.type`}
            render={({ field }) => (
              <UI.RadioButtons
                value={field.value}
                key={variant.variantIndex}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <UI.RadioButton icon={Mail} value="EMAIL" text={t('email')} description={t('campaign_email_helper')} />
                <UI.RadioButton icon={Smartphone} value="SMS" text={t('sms')} description={t('campaign_sms_helper')} />
              </UI.RadioButtons>
            )}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.Flex justifyContent="space-between" alignItems="flex-start">
            <UI.FormLabel htmlFor={`variants.${activeVariantIndex}.body`}>{t('body')}</UI.FormLabel>
            {activeVariant.type === 'SMS' && (
              <UI.Div mb={2}>
                <UI.ColumnFlex alignItems="flex-end">
                  <UI.Helper>{t('character_limit')}</UI.Helper>
                  <CircularProgress
                    mt={2}
                    color={activeVariant.body.length <= 160 ? 'green' : 'red'}
                    value={percentageFull}
                  >
                    <CircularProgressLabel>{activeVariant?.body?.length}</CircularProgressLabel>
                  </CircularProgress>
                </UI.ColumnFlex>
              </UI.Div>
            )}
          </UI.Flex>
          <Controller
            key={variant.variantIndex}
            name={`variants.${activeVariantIndex}.body`}
            // TODO: Check how id={`variants[${activeVariantIndex}].body`} can be added back
            control={form.control}
            defaultValue={activeVariant.body}
            render={({ field }) => (
              <UI.MarkdownEditor
                value={field.value}
                onChange={(e) => {
                  // TODO: Fix percentage
                  field.onChange(e);
                }}
              />
            )}
          />
        </UI.FormControl>
      </UI.InputGrid>
    </UI.CardBody>
  );
};

interface CreateCampaignFormProps {
  isReadOnly?: boolean;
  onClose?: () => void;
  campaign?: CampaignFormProps;
}

const campaignDefaultValues: CampaignFormProps = {
  label: '',
  customVariables: [{ key: '' }],
  variants: [
    {
      label: '',
      type: 'EMAIL',
      from: undefined,
      body: createCampaignBodyPlaceholder,
      weight: 50,
      // @ts-ignore
      dialogue: undefined,
    },
    {
      label: '',
      type: 'EMAIL',
      from: undefined,
      body: createCampaignBodyPlaceholder,
      weight: 50,
      // @ts-ignore
      dialogue: undefined,
    },
  ],
};

const CreateCampaignForm = ({ onClose, isReadOnly = false, campaign }: CreateCampaignFormProps) => {
  const { activeCustomer } = useCustomer();
  const toast = useToast();
  const { t } = useTranslation();

  const form = useForm<CampaignFormProps>({
    defaultValues: campaign || campaignDefaultValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [createCampaign] = useCreateCampaignMutation({
    variables: {
      input: {
        label: form.getValues().label,
        workspaceId: activeCustomer?.id || '',
        variants: form.getValues().variants?.map((variant) => ({
          dialogueId: variant.dialogue?.value || '',
          body: variant.body,
          label: variant.label,
          subject: '',
          weight: variant.weight,
          from: variant.from || undefined,
          type: variant.type as CampaignVariantEnum,
          customVariables: form.getValues().customVariables?.map((val) => val || { key: '' }),
          workspaceId: activeCustomer?.id || '',
        })),
      },
    },
    refetchQueries: [
      refetchGetWorkspaceCampaignsQuery({
        customerSlug: activeCustomer?.slug || '',
      }),
    ],
    onCompleted: () => {
      toast({
        title: t('toast:campaign_created'),
        description: t('toast:campaign_created_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      onClose?.();
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });

      onClose?.();
    },
  });

  const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);

  const switchActiveVariant = (index: number) => {
    if (activeVariantIndex === index) {
      setActiveVariantIndex(null);
    } else {
      setActiveVariantIndex(index);
    }
  };

  const { fields: variants } = useFieldArray({
    name: 'variants',
    control: form.control,
    keyName: 'variantIndex',
  }) as { fields: any[] };

  const { append: addCustomVariable, fields: customVariables } = useFieldArray({
    name: 'customVariables',
    control: form.control,
    keyName: 'idKey',
  }) as any;

  const handleVariantWeightChange = (event: any, currentItemIndex: number) => {
    const maxValue = Math.min(event.target.value, 100);
    const value = Math.max(maxValue, 0);

    const otherFields = variants.map((item, index) => ({
      ...item,
      originalIndex: index,
    })).filter((item, index) => index !== currentItemIndex);

    const distributed = 100 - value;
    otherFields.forEach((field) => {
      form.setValue(`variants.${field.originalIndex}.weight`, distributed);
    });

    form.setValue(`variants.${currentItemIndex}.weight`, value);
  };

  const handleSubmit = () => {
    if (!isReadOnly) {
      createCampaign();
    }
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.Grid gridTemplateColumns={['1fr', '1fr 2fr']}>
        <UI.Stack spacing={4}>
          <UI.FormControl isRequired>
            <UI.FormLabel htmlFor="label">{t('campaign_label')}</UI.FormLabel>
            <UI.Input id="label" {...form.register('label')} isDisabled={isReadOnly} />
          </UI.FormControl>
          <UI.Div>
            <UI.InputHeader>{t('variants')}</UI.InputHeader>
            <UI.InputHelper>{t('variants_helper')}</UI.InputHelper>
            <UI.Stack spacing={2}>
              {variants.map((variant, index) => (
                <UI.Flex
                  key={variant.variantIndex}
                >
                  <UI.ButtonCard
                    onClick={() => switchActiveVariant(index)}
                    isActive={activeVariantIndex === index}
                    bg="white"
                  >
                    {`${t('variant')} ${mapVariantIndexToLabel[index]}`}
                  </UI.ButtonCard>
                  <UI.Div ml={2} maxWidth={100}>
                    <Controller
                      defaultValue={variant.weight}
                      name={`variants.${index}.weight`}
                      control={form.control}
                      render={({ field }) => (
                        <UI.Input
                          value={field.value}
                          onChange={(e: InputEvent) => {
                            handleVariantWeightChange(e, index);
                          }}
                          isDisabled={isReadOnly}
                          onBlur={field.onBlur}
                          type="number"
                          rightAddOn="%"
                        />
                      )}
                    />
                  </UI.Div>
                </UI.Flex>
              ))}
            </UI.Stack>
          </UI.Div>

          <UI.Div>
            <UI.FormControl>
              <UI.InputHeader>{t('custom_variables')}</UI.InputHeader>
              <UI.InputHelper>{t('custom_variables_helper')}</UI.InputHelper>
              <UI.Stack spacing={1}>
                {customVariables.map((customVariable: any, index: number) => (
                  <UI.Input
                    key={customVariable.idKey}
                    defaultValue={customVariable.key}
                    {...form.register(`customVariables.${index}.key`)}
                  />
                ))}
              </UI.Stack>

              <UI.Button mt={2} onClick={() => addCustomVariable({ key: '' })}>Add variable</UI.Button>
            </UI.FormControl>
          </UI.Div>
        </UI.Stack>
        <UI.Card isFlat noHover bg="gray.100">
          {(activeVariantIndex === 0 || activeVariantIndex) ? (
            <ActiveVariantForm
              isReadOnly={isReadOnly}
              variant={variants[activeVariantIndex]}
              activeVariantIndex={activeVariantIndex}
              form={form}
            />
          ) : (
            <UI.IllustrationCard
              svg={<DecideIll />}
              text={t('select_a_variant')}
              isFlat
            />
          )}
        </UI.Card>
        <UI.Button type="submit" isDisabled={!form.formState.isValid || isReadOnly}>
          {t('save')}
        </UI.Button>
      </UI.Grid>
    </UI.Form>
  );
};

export default CreateCampaignForm;
