import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Bell, Clock, MessageSquare, PlusCircle, Type } from 'react-feather';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Div, Form, FormContainer, FormControl, FormLabel,
  FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted,
} from '@haas/ui';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { motion } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers';

import { CreateConditionModalCard } from './CreateConditionModalCard';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.string().required(),
  conditions: yup.array().of(
    yup.object().required().shape(
      {
        logic: yup.string().notRequired(),
        operator: yup.string().notRequired(),
        compareTo: yup.number().notRequired(),
      },
    ),
  ),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

const AddAutomationView = () => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      automationType: 'TRIGGER',
      conditions: [],
    },
  });

  const { t } = useTranslation();

  const { append, fields: conditionFields } = useFieldArray({
    name: 'conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data; ', formData);
  };

  console.log('Condition fields: ', conditionFields);

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:add_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
          <FormContainer>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormSection id="general">
                <Div>
                  <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:about')}</H3>
                  <Muted color="gray.600">
                    {t('automation:about_helper')}
                  </Muted>
                </Div>
                <Div>
                  <InputGrid>
                    <FormControl isRequired isInvalid={!!form.errors.title}>
                      <FormLabel htmlFor="title">{t('title')}</FormLabel>
                      <InputHelper>{t('automation:title_helper')}</InputHelper>
                      <Input
                        placeholder={t('automation:title_placeholder')}
                        leftEl={<Type />}
                        name="title"
                        ref={form.register({ required: true })}
                      />
                      <UI.ErrorMessage>{t(form.errors.title?.message || '')}</UI.ErrorMessage>
                    </FormControl>

                    <UI.FormControl>
                      <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                      <InputHelper>{t('automation:type_helper')}</InputHelper>
                      <Controller
                        control={form.control}
                        name="automationType"
                        defaultValue="TRIGGER"
                        render={({ onBlur, onChange, value }) => (
                          <UI.RadioButtons onBlur={onBlur} onChange={onChange} value={value}>
                            <UI.RadioButton
                              icon={Bell}
                              value="TRIGGER"
                              mr={2}
                              text={(t('automation:trigger'))}
                              description={t('automation:trigger_helper')}
                            />
                            <UI.RadioButton
                              icon={Clock}
                              isDisabled
                              value="RECURRING"
                              mr={2}
                              text={(t('automation:recurring'))}
                              description={t('automation:recurring_helper')}
                            />
                            <UI.RadioButton
                              icon={MessageSquare}
                              isDisabled
                              value="CAMPAIGNER"
                              mr={2}
                              text={(t('automation:campaigner'))}
                              description={t('automation:campaigner_helper')}
                            />
                          </UI.RadioButtons>
                        )}
                      />
                    </UI.FormControl>

                  </InputGrid>
                </Div>
              </FormSection>

              <Hr />

              <FormSection id="conditions">
                <Div>
                  <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:conditions')}</H3>
                  <Muted color="gray.600">
                    {t('automation:conditions_helper')}
                  </Muted>
                </Div>
                {conditionFields.length === 0 && (
                  <UI.IllustrationCard svg={<EmptyIll />} text={t('trigger:condition_placeholder')}>
                    <Button
                      leftIcon={PlusCircle}
                      onClick={() => setCreateModalIsOpen(true)}
                      size="sm"
                      variant="outline"
                      variantColor="teal"
                    >
                      {t('trigger:add_condition')}
                    </Button>
                  </UI.IllustrationCard>
                )}

              </FormSection>

              <ButtonGroup>
                <Button
                  isDisabled={!form.formState.isValid}
                  // isLoading={isLoading}
                  variantColor="teal"
                  type="submit"
                >
                  {t('create')}
                </Button>
                <Button variant="outline" onClick={() => history.push('/')}>
                  {t('cancel')}
                </Button>
              </ButtonGroup>
            </Form>
          </FormContainer>
        </motion.div>
      </UI.ViewBody>

      <UI.Modal willCloseOnOutsideClick={false} isOpen={createModalIsOpen} onClose={() => setCreateModalIsOpen(false)}>
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(callToAction: any) => {
            // handleChange(callToAction);
          }}
        />
      </UI.Modal>
    </>
  );
};

export default AddAutomationView;
