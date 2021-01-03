import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Controller, UseFormMethods, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useState } from 'react';

import { ReactComponent as DecideIll } from 'assets/images/undraw_decide.svg';
import { Mail, Smartphone } from 'react-feather';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from '@chakra-ui/core';
import Select from 'react-select';
import gql from 'graphql-tag';

import { useGetWorkspaceDialoguesQuery, useCreateCampaignMutation, CampaignVariantEnum } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

const CREATE_CAMPAIGN_MUTATION = gql`
  mutation createCampaignMutation($input: CreateCampaignInputType) {
    createCampaign(input: $input) {
      id
    }
  }
`;

type InputEvent = React.FormEvent<HTMLInputElement>;

const createCampaignBodyPlaceholder = `Dear {{firstName}},
thank you for subscribing to {{dialogueId}}!
Please visit {{dialogueUrl}}.
`;

const mapVariantIndexToLabel: { [key: number]: string } = {
  0: 'A',
  1: 'B',
};

const variantSchema = yup.object({
  label: yup.string().required(),
  type: yup.mixed().oneOf(['EMAIL', 'SMS']).required(),
  dialogue: yup.object({
    label: yup.string(),
    value: yup.string(),
  }).required(),
  body: yup.string().required(),
  weight: yup.number().required(),
}).required();

const schema = yup.object({
  label: yup.string().required(),
  variants: yup.array().of(variantSchema),
}).required();

type FormProps = yup.InferType<typeof schema>;
type VariantFormProps = yup.InferType<typeof variantSchema>;

const ActiveVariantForm = ({ form, activeVariantIndex, variant }: { form: UseFormMethods<FormProps>, activeVariantIndex: number, variant: any }) => {
  const activeVariant = form.watch(`variants[${activeVariantIndex}]`) as VariantFormProps;
  const { t } = useTranslation();

  const { customerSlug } = useNavigator();

  const { data } = useGetWorkspaceDialoguesQuery({
    variables: {
      customerSlug
    }
  });

  const dialogues = data?.customer?.dialogues?.map(dialogue => ({
    label: dialogue.title,
    value: dialogue.id
  })) || [];

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
            name={`variants[${activeVariantIndex}].label`}
            defaultValue={activeVariant?.label}
            id={`variants[${activeVariantIndex}].label`}
            ref={form.register()}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor={`variants[${activeVariantIndex}].dialogue`}>{t('dialogue')}</UI.FormLabel>
          <Controller
            name={`variants[${activeVariantIndex}].dialogue`}
            key={variant.variantIndex}
            control={form.control}
            defaultValue={activeVariant.dialogue || null}
            render={({ value, onChange, onBlur }) => (
              <Select
                placeholder="Select a dialogue"
                id={`variants[${activeVariantIndex}].dialogue`}
                classNamePrefix="select"
                className="select"
                defaultOptions
                options={dialogues}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel>{t('distribution')}</UI.FormLabel>
          <Controller
            control={form.control}
            defaultValue={variant.type}
            name={`variants[${activeVariantIndex}].type`}
            render={({ onChange, value, onBlur }) => (
              <UI.RadioButtons
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              >
                <UI.RadioButton icon={Mail} value="EMAIL" text={t('email')} description={t('campaign_email_helper')} />
                <UI.RadioButton icon={Smartphone} value="SMS" text={t('sms')} description={t('campaign_sms_helper')} />
              </UI.RadioButtons>
            )}
          />
        </UI.FormControl>

        <UI.FormControl isRequired>
          <UI.FormLabel htmlFor={`variants[${activeVariantIndex}].body`}>{t('body')}</UI.FormLabel>
          <Controller
            key={variant.variantIndex}
            name={`variants[${activeVariantIndex}].body`}
            id={`variants[${activeVariantIndex}].body`}
            control={form.control}
            defaultValue={activeVariant.body}
            render={({ value, onChange }) => (
              <UI.MarkdownEditor
                value={value}
                onChange={onChange}
              />
            )}
          />
        </UI.FormControl>
      </UI.InputGrid>
    </UI.CardBody>
  );
};

const CreateCampaignForm = ({ onClose }: { onClose: () => void }) => {
  const { activeCustomer } = useCustomer();
  const toast = useToast();
  const { t } = useTranslation();

  const form = useForm<FormProps>({
    defaultValues: {
      label: '',
      variants: [
        {
          label: '',
          type: 'EMAIL',
          body: createCampaignBodyPlaceholder,
          weight: 50,
          dialogue: undefined,
        },
        {
          label: '',
          type: 'EMAIL',
          body: createCampaignBodyPlaceholder,
          weight: 50,
          dialogue: undefined,
        },
      ],
    },
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
          type: variant.type as CampaignVariantEnum,
          workspaceId: activeCustomer?.id || '',
        })),
      },
    },
    onCompleted: () => {
      toast({
        title: t('toast:campaign_created'),
        description: t('toast:campaign_created_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      onClose();
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
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
  });

  const handleVariantWeightChange = (event: any, currentItemIndex: number) => {
    const maxValue = Math.min(event.target.value, 100);
    const value = Math.max(maxValue, 0);

    const otherFields = variants.map((item, index) => ({ ...item, originalIndex: index })).filter((item, index) => index !== currentItemIndex);
    const distributed = 100 - value;
    otherFields.forEach((field) => {
      form.setValue(`variants.${field.originalIndex}.weight`, distributed);
    });

    form.setValue(`variants.${currentItemIndex}.weight`, value);
  };

  const handleSubmit = () => {
    createCampaign();
  };

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.Grid gridTemplateColumns={['1fr', '1fr 2fr']}>
        <UI.Stack spacing={4}>
          <UI.FormControl isRequired>
            <UI.FormLabel htmlFor="label">{t('campaign_label')}</UI.FormLabel>
            <UI.Input name="label" id="label" ref={form.register} />
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
                      render={({ value, onBlur }) => (
                        <UI.Input
                          value={value}
                          onChange={(e: InputEvent) => {
                            handleVariantWeightChange(e, index);
                          }}
                          onBlur={onBlur}
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
        </UI.Stack>
        <UI.Card isFlat noHover bg="gray.100">
          {(activeVariantIndex === 0 || activeVariantIndex) ? (
            <ActiveVariantForm
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
        <UI.Button type="submit" isDisabled={!form.formState.isValid}>
          {t('save')}
        </UI.Button>
      </UI.Grid>
    </UI.Form>
  );
};

export default CreateCampaignForm;
