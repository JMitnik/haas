import { Activity, Briefcase, Clipboard, Link, Link2, Loader, Minus, Upload } from 'react-feather';
import { Button, ButtonGroup, RadioButtonGroup, useToast } from '@chakra-ui/core';
import { Controller, UseFormMethods } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted,
  RadioButton,
} from '@haas/ui';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React from 'react';
import intToBool from 'utils/intToBool';

import ColorPickerInput from 'components/ColorPicker';

import FileDropInput from 'components/FileDropInput';
import ServerError from 'components/ServerError';
import useAuth from 'hooks/useAuth';

import uploadSingleImage from '../../mutations/uploadSingleImage';

interface FormDataProps {
  name: string;
  website: string;
  logo?: string;
  primaryColour: string;
  useCustomUrl?: number;
  uploadLogo?: string;
  firstName?: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

const CustomerUploadLogoInput = ({ onChange, value }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useMutation(uploadSingleImage, {
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      onChange(result.singleUpload.url);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to upload file. Try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const onDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    uploadFile({ variables: { file } });
  };

  return (
    <>
      <FileDropInput value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

const CustomerLogoFormFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        <FormLabel>{t('logo')}</FormLabel>
        <InputHelper>{t('customer:logo_helper')}</InputHelper>

        <Controller
          control={form.control}
          name="useCustomUrl"
          defaultValue={1}
          render={({ onChange, value }) => (
            <RadioButtonGroup
              value={value}
              isInline
              onChange={onChange}
              display="flex"
            >
              <RadioButton icon={Link2} value={1} text={t('existing_url')} description={t('existing_url_helper')} />
              <RadioButton icon={Upload} value={0} text={t('upload_file')} description={t('upload_file_helper')} />
            </RadioButtonGroup>
          )}
        />

      </FormControl>

      {form.watch('useCustomUrl') ? (
        <FormControl>
          <FormLabel htmlFor="logo">{t('logo_existing_url')}</FormLabel>
          <InputHelper>{t('logo_existing_url_helper')}</InputHelper>
          <Input
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
            leftEl={<Link />}
            name="logo"
            isInvalid={!!form.errors.logo}
            ref={form.register()}
          />
        </FormControl>

      ) : (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadLogo"
              defaultValue=""
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput value={value} onChange={onChange} />
              )}
            />
          </FormControl>
        </>
      )}
    </>
  );
};

const DialogueMultiChoiceFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl isInvalid={!!form.errors.answer1} isRequired>
        <FormLabel htmlFor="answer1">{t('autodeck:answer_1')}</FormLabel>
        <InputHelper>{t('autodeck:answer_1_helper')}</InputHelper>
        <Input
          placeholder="Terrible support"
          leftEl={<Briefcase />}
          name="answer1"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer2} isRequired>
        <FormLabel htmlFor="answer2">{t('autodeck:answer_2')}</FormLabel>
        <InputHelper>{t('autodeck:answer_2_helper')}</InputHelper>
        <Input
          placeholder="No space"
          leftEl={<Briefcase />}
          name="answer2"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer3} isRequired>
        <FormLabel htmlFor="name">{t('autodeck:answer_3')}</FormLabel>
        <InputHelper>{t('autodeck:answer_3_helper')}</InputHelper>
        <Input
          placeholder="No internet"
          leftEl={<Briefcase />}
          name="answer3"
          ref={form.register()}
        />
      </FormControl>

      <FormControl isInvalid={!!form.errors.answer4} isRequired>
        <FormLabel htmlFor="answer4">{t('autodeck:answer_4')}</FormLabel>
        <InputHelper>{t('autodeck:answer_4_helper')}</InputHelper>
        <Input
          placeholder="Rude personnel"
          leftEl={<Briefcase />}
          name="answer4"
          ref={form.register()}
        />
      </FormControl>
    </>
  );
};

interface CustomerFormProps {
  form: any;
  onFormSubmit: any;
  serverErrors: any;
  isLoading: any;

  // Customer-specific
  // eslint-disable-next-line react/require-default-props
  isInEdit?: boolean;
}

const AutodeckForm = ({ form, onFormSubmit, isLoading, serverErrors, isInEdit = false }: CustomerFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
      <ServerError serverError={serverErrors} />
      <FormSection id="about">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('about')}</H3>
          <Muted color="gray.600">
            {t('customer:about_helper')}
          </Muted>
        </Div>
        <Div py={4}>
          <InputGrid>
            <FormControl isInvalid={!!form.errors.name} isRequired>
              <FormLabel htmlFor="name">{t('name')}</FormLabel>
              <InputHelper>{t('customer:name_helper')}</InputHelper>
              <Input
                placeholder="Peach inc."
                leftEl={<Briefcase />}
                name="name"
                ref={form.register()}
              />
            </FormControl>

            <FormControl isInvalid={!!form.errors.website} isRequired>
              <FormLabel htmlFor="website">{t('autodeck:website')}</FormLabel>
              <InputHelper>{t('autodeck:website_helper')}</InputHelper>
              <Input
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
                leftEl={<Link />}
                name="website"
                // isInvalid={!!form.errors.logo}
                ref={form.register()}
              />
            </FormControl>
          </InputGrid>
        </Div>
      </FormSection>

      <Hr />

      <FormSection id="branding">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('branding')}</H3>
          <Muted color="gray.600">
            {t('customer:branding_helper')}
          </Muted>
        </Div>
        <Div>
          <InputGrid>
            <FormControl isInvalid={!!form.errors.primaryColour} isRequired>
              <FormLabel htmlFor="primaryColour">{t('branding_color')}</FormLabel>
              <InputHelper>{t('customer:branding_color_helper')}</InputHelper>
              <Controller
                control={form.control}
                name="primaryColour"
                defaultValue="#BEE3F8"
                as={<ColorPickerInput />}
              />
            </FormControl>
          </InputGrid>

          <InputGrid>
            <CustomerLogoFormFragment form={form} />
          </InputGrid>
        </Div>
      </FormSection>

      <Hr />

      <FormSection id="dialogue">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('autodeck:dialogue')}</H3>
          <Muted color="gray.600">
            {t('autodeck:dialogue_helper')}
          </Muted>
        </Div>
        <Div>
          <InputGrid>
            <FormControl isInvalid={!!form.errors.firstName} isRequired>
              <FormLabel htmlFor="name">{t('autodeck:client_first_name')}</FormLabel>
              <InputHelper>{t('autodeck:client_first_name_helper')}</InputHelper>
              <Input
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
                leftEl={<Link />}
                name="firstName"
                // isInvalid={!!form.errors.logo}
                ref={form.register()}
              />
            </FormControl>
            <DialogueMultiChoiceFragment form={form} />
          </InputGrid>
        </Div>
      </FormSection>

      <ButtonGroup>
        <Button
          isLoading={isLoading}
          isDisabled={!form.formState.isValid}
          variantColor="teal"
          type="submit"
        >
          {isInEdit ? t('edit') : t('create')}
        </Button>
        <Button variant="outline" onClick={() => history.goBack()}>{t('cancel')}</Button>
      </ButtonGroup>
    </Form>
  );
};

export default AutodeckForm;
