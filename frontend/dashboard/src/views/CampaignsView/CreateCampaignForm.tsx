import * as UI from '@haas/ui';
import * as yup from 'yup';
import { UseFormMethods, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useState } from 'react';

import { ArrowRight, Check } from 'react-feather';
import { useCustomer } from 'providers/CustomerProvider';
import { useToast } from '@chakra-ui/core';

import { useGetWorkspaceDialoguesQuery, useCreateCampaignMutation, CampaignVariantEnum, refetchGetWorkspaceCampaignsQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import styled, { css } from 'styled-components';
import CampaignVariantsBuilder from './CampaignVariantsBuilder/CampaignVariantsBuilder';

type InputEvent = React.FormEvent<HTMLInputElement>;

const createCampaignBodyPlaceholder = `Dear {{firstName}},
thank you for subscribing to {{dialogueId}}!
Please visit {{dialogueUrl}}.`;

const SMS_LIMIT_CHARACTERS = 160;

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
    },
    fetchPolicy: 'cache-and-network'
  });

  const dialogues = data?.customer?.dialogues?.map(dialogue => ({
    label: dialogue.title,
    value: dialogue.id
  })) || [];

  console.log(data);
  const percentageFull = Math.min(Math.floor((activeVariant.body.length / SMS_LIMIT_CHARACTERS) * 100), 100);

  return (
    <UI.CardBody id="subForm">
      {/* <UI.InputGrid>
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
            key={variant.variantIndex}
            control={form.control}
            defaultValue={activeVariant.type}
            name={`variants[${activeVariantIndex}].type`}
            render={({ onChange, value, onBlur }) => (
              <UI.RadioButtons
                value={value}
                key={variant.variantIndex}
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
          <UI.Flex justifyContent="space-between" alignItems="flex-start">
            <UI.FormLabel htmlFor={`variants[${activeVariantIndex}].body`}>{t('body')}</UI.FormLabel>
            {activeVariant.type === 'SMS' && (
              <UI.Div mb={2}>
                <UI.ColumnFlex alignItems="flex-end">
                  <UI.Helper>{t('character_limit')}</UI.Helper>
                  <CircularProgress
                    mt={2} color={activeVariant.body.length <= 160 ? 'green' : 'red'} value={percentageFull}>
                    <CircularProgressLabel>{activeVariant?.body?.length}</CircularProgressLabel>
                  </CircularProgress>
                </UI.ColumnFlex>
              </UI.Div>
            )}
          </UI.Flex>
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
      </UI.InputGrid> */}
    </UI.CardBody>
  );
};

enum CampaignStep {
  CREATE,
  VARIANT,
  IMPORT
}

interface FooterLegendStepProps {
  children: React.ReactNode;
  index?: number;
  isActive?: boolean;
  isFinished?: boolean;
  onClick?: () => void;
}

const FooterLegendStepContainer = styled.div<FooterLegendStepProps>`
  ${({ theme, isActive, isFinished }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.gutter}px;
    font-weight: 500;
    color: ${theme.colors.gray[500]};

    ${FooterLegendStepIndex} {
      margin-right: ${theme.gutter / 4}px;
    }

    ${isActive && css`
      color: ${theme.colors.blue[500]};

      ${FooterLegendStepIndex} {
        margin-left: ${theme.gutter / 4}px;
        background: ${theme.colors.blue[100]};
        color: ${theme.colors.blue[500]};
      }
    `}

    ${isFinished && css`
      ${FooterLegendStepIndex} {
        margin-left: ${theme.gutter / 4}px;
        background: ${theme.colors.green[100]};
        color: ${theme.colors.green[500]};

        svg {
          width: 75%;
          margin: 0 auto;
        }
      }
    `}
  `}
`;

const FooterLegendStepIndex = styled.div`
  ${({ theme }) => css`
    display: flex;
    height: 17px;
    width: 17px;
    font-weight: 600;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: 0.6rem;
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[400]};
  `}
`;

const FooterLegendStep = ({ index, isActive, isFinished, children, onClick }: FooterLegendStepProps) => {
  return (
    <FooterLegendStepContainer isActive={isActive} isFinished={isFinished} onClick={onClick}>
      <FooterLegendStepIndex>
        {!isFinished ? (
          <>{index}</>
        ) : (
          <UI.Icon><Check /></UI.Icon>
        )}
      </FooterLegendStepIndex>
      {children}
    </FooterLegendStepContainer>
  )
};

const possibleVariants = ['A', 'B', 'C', 'D', 'E'];

const CreateCampaignForm = ({ onClose }: { onClose?: () => void }) => {
  const { activeCustomer } = useCustomer();
  const toast = useToast();
  const { t } = useTranslation();

  const form = useForm<FormProps>({
    defaultValues: {
      label: '',
      variants: [
        {
          label: 'A',
          type: 'EMAIL',
          body: createCampaignBodyPlaceholder,
          weight: 100,
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
    refetchQueries: [
      refetchGetWorkspaceCampaignsQuery({
        customerSlug: activeCustomer?.slug || ''
      })
    ],
    onCompleted: (output) => {
      if (output.createCampaign.__typename === 'CreateCampaignProblemType') {
        // TODO: Do something with these errors
        console.log(output.createCampaign.problemMessage);
      }

      if (output.createCampaign.__typename === 'CreateCampaignSuccessType') {
        // TODO: Do something with these errors
        toast({
          title: t('toast:campaign_created'),
          description: t('toast:campaign_created_helper'),
          status: 'success',
          position: 'bottom-right',
          duration: 1500,
        });
      }

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

  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  const { fields: variants, append } = useFieldArray({
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

  const addVariant = () => {
    const currentItemIndex: number = variants.length;

    append({
      label: possibleVariants[currentItemIndex],
      type: 'EMAIL',
      body: createCampaignBodyPlaceholder,
      weight: 100,
      dialogue: undefined,
    });
  }

  const handleSubmit = () => {
    createCampaign();
  };

  const [activeStep, setActiveStep] = useState<CampaignStep>(CampaignStep.VARIANT);

  return (
    <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
      <UI.Div py={2}>
        {activeStep === CampaignStep.CREATE && (
          <UI.FormControl isRequired>
            <UI.FormLabel htmlFor="label">{t('campaign_label')}</UI.FormLabel>
            <UI.Input name="label" id="label" ref={form.register} />
          </UI.FormControl>
        )}
        {activeStep === CampaignStep.VARIANT && (
          <UI.Div>
            <UI.InputHeader>{t('variants')}</UI.InputHeader>
            <UI.InputHelper>{t('variants_helper')}</UI.InputHelper>
            <CampaignVariantsBuilder />
            {/* <UI.Tabs>
              {variants.map((variant, index) => (
                <UI.Tab onClick={() => setActiveVariantIndex(index)} isActive={activeVariantIndex===index} key={index}>
                  <UI.Flex alignItems="center">
                    <UI.Span mr={2}>
                      Variant {variant.label}
                    </UI.Span>
                    <UI.Div maxWidth={100}>
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
                            size="sm"
                            rightAddOn="%"
                          />
                        )}
                      />
                      </UI.Div>
                  </UI.Flex>
                </UI.Tab>
              ))}
              <UI.AddTabButton onClick={addVariant}>Add variant</UI.AddTabButton>
            </UI.Tabs> */}
            <ActiveVariantForm form={form} activeVariantIndex={activeVariantIndex} variant={variants[activeVariantIndex]} />
          </UI.Div>
        )}
      </UI.Div>
      <UI.Stack isInline spacing={2} py={4} justifyContent="center" alignItems="center">
        <FooterLegendStep
          onClick={() => setActiveStep(CampaignStep.CREATE)}
          index={1} isActive={activeStep === CampaignStep.CREATE}
          >
          Create a campaign
        </FooterLegendStep>
        <FooterLegendStep
          index={2}
          onClick={() => setActiveStep(CampaignStep.VARIANT)}
          isActive={activeStep === CampaignStep.VARIANT}
          >
          Design a campaign variant
        </FooterLegendStep>
        <FooterLegendStep
          index={3}
          onClick={() => setActiveStep(CampaignStep.IMPORT)}
          isActive={activeStep === CampaignStep.IMPORT}
        >
          Import your first delivery
        </FooterLegendStep>
      </UI.Stack>
      {activeStep === CampaignStep.CREATE && (
        <UI.Button rightIcon={ArrowRight} type="submit">
          {t('continue')}
        </UI.Button>
      )}
    </UI.Form>
  );
};

export default CreateCampaignForm;
