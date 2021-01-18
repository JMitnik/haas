import * as yup from 'yup';
import { Activity, Briefcase, Clipboard, Link, Link2, Loader, Minus, Upload } from 'react-feather';
import { Button, ButtonGroup, RadioButtonGroup, useToast } from '@chakra-ui/core';
import { Controller, UseFormMethods, useForm } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted,
  RadioButton,
  RadioButtons,
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

// interface FormDataProps {
//   name: string;
//   website: string;
//   logo?: string;
//   primaryColour: string;
//   useCustomUrl?: number;
//   uploadLogo?: string;
//   firstName?: string;
//   answer1: string;
//   answer2: string;
//   answer3: string;
//   answer4: string;
// }

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

const WebsiteScreenshotFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        <FormLabel>{t('logo')}</FormLabel>
        <InputHelper>{t('customer:logo_helper')}</InputHelper>

        <Controller
          control={form.control}
          name="useWebsiteUrl"
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

      {form.watch('useWebsiteUrl') ? (
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

const PrimaryColourFragment = ({ form }: { form: UseFormMethods<FormDataProps> }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        <FormLabel>{t('autodeck:primary_color')}</FormLabel>
        <InputHelper>{t('autodeck:primary_color_helper')}</InputHelper>

        <Controller
          control={form.control}
          key={'customer_color_controller'}
          name="useCustomColour"
          defaultValue={1}
          render={({ onChange, onBlur, value }) => (
            <RadioButtons
              value={value}
              key={'customer_color_key'}
              onChange={onChange}
              onBlur={onBlur}
            >
              <RadioButton icon={Link2} value={1} text={t('autodeck:logo_color')} description={t('autodeck:logo_color_helper')} />
              <RadioButton icon={Clipboard} value={0} text={t('autodeck:custom_color')} description={t('autodeck:custom_color_helper')} />
            </RadioButtons>
          )}
        />

      </FormControl>

      {form.watch('useCustomColour') === 0 &&
        <>
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
        </>
      }
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

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  website: yup.string().required('Website is required'),
  logo: yup.string().url('Url should be valid'),
  primaryColour: yup.string().required().matches(/^(#(\d|\D){6}$){1}/, {
    message: 'Provided colour is not a valid hexadecimal',
  }),
  useCustomUrl: yup.number(),
  useCustomColour: yup.number(),
  uploadLogo: yup.string().url(),
  firstName: yup.string(),
  answer1: yup.string().required('Answer #1 is required'),
  answer2: yup.string().required('Answer #1 is required'),
  answer3: yup.string().required('Answer #1 is required'),
  answer4: yup.string().required('Answer #1 is required'),
}).required();

type FormDataProps = yup.InferType<typeof schema>;


const AutodeckForm = ({ onClose }: { onClose: () => void; }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const form = useForm<FormDataProps>({
    defaultValues: {
      useCustomUrl: 0,
      useCustomColour: 1,
    },
    mode: 'all'
  });

  const onFormSubmit = (data: FormDataProps) => {
    console.log('Data: ', data);
  }

  const isPreprocessed = false;

  console.log(form.watch('useCustomUrl'))

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
      <FormSection id="about">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('general')}</H3>
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
          </InputGrid>
        </Div>
      </FormSection>

      <Hr />

      <FormSection id="logomanipulation">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('pre_processing')}</H3>
          <Muted color="gray.600">
            {t('customer:branding_helper')}
          </Muted>
        </Div>
        <Div>
          <InputGrid>
            <CustomerLogoFormFragment form={form} />
          </InputGrid>
          <Hr />
          <InputGrid>
            <PrimaryColourFragment form={form} />
          </InputGrid>
        </Div>
      </FormSection>

      <Hr />
      <FormSection id="website">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('pre_processing')}</H3>
          <Muted color="gray.600">
            {t('customer:branding_helper')}
          </Muted>
        </Div>
        <Div>
          <InputGrid>
            <WebsiteScreenshotFragment form={form} />
          </InputGrid>
        </Div>
      </FormSection>
      {isPreprocessed &&
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
      }

      <ButtonGroup>
        <Button
          // isLoading={isLoading}
          isDisabled={!form.formState.isValid}
          variantColor="teal"
          type="submit"
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => history.goBack()}>{t('cancel')}</Button>
      </ButtonGroup>
    </Form>
  );
};

export default AutodeckForm;
