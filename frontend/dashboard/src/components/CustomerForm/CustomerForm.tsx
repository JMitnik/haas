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
  slug: string;
  logo?: string;
  primaryColour?: string;
  useCustomUrl?: number;
  willGenerateFakeData?: number,
  uploadLogo?: string;
  seed?: number;
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

interface CustomerFormProps {
  form: any;
  onFormSubmit: any;
  serverErrors: any;
  isLoading: any;

  // Customer-specific
  // eslint-disable-next-line react/require-default-props
  isInEdit?: boolean;
}

const CustomerForm = ({ form, onFormSubmit, isLoading, serverErrors, isInEdit = false }: CustomerFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { canAccessAdmin } = useAuth();

  const usesSeed = intToBool(form.watch('seed'));

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

            <FormControl isInvalid={!!form.errors.slug} isRequired>
              <FormLabel htmlFor="name">{t('slug')}</FormLabel>
              <InputHelper>{t('customer:slug_helper')}</InputHelper>
              <Input
                placeholder="peach"
                leftAddOn="https://client.haas.live/"
                name="slug"
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

      {!isInEdit && canAccessAdmin && (
        <>
          <Hr />

          <FormSection id="template">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>{t('template')}</H3>
              <Muted color="gray.600">
                {t('customer:template_helper')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl>
                  <FormLabel>{t('customer:use_template')}</FormLabel>
                  <InputHelper>{t('customer:use_template_helper')}</InputHelper>
                  <Controller
                    name="seed"
                    render={({ onChange, onBlur, value }) => (
                      <RadioButtonGroup display="flex" onBlur={onBlur} value={value} onChange={onChange}>
                        <RadioButton
                          icon={Clipboard}
                          value={1}
                          mr={2}
                          text={(t('customer:custom_template'))}
                          description={t('customer:custom_template_helper')}
                        />
                        <RadioButton
                          icon={Loader}
                          value={0}
                          text={(t('customer:no_custom_template'))}
                          description={t('customer:no_custom_template_helper')}
                        />
                      </RadioButtonGroup>
                    )}
                    control={form.control}
                    defaultValue={1}
                  />

                </FormControl>

                {usesSeed && (
                  <FormControl>
                    <FormLabel>{t('customer:fake_data')}</FormLabel>
                    <InputHelper>{t('customer:fake_data_helper')}</InputHelper>
                    <Controller
                      name="willGenerateFakeData"
                      render={({ onChange, onBlur, value }) => (
                        <RadioButtonGroup display="flex" onBlur={onBlur} value={value} onChange={onChange}>
                          <RadioButton
                            icon={Activity}
                            value={1}
                            mr={2}
                            text={(t('customer:use_fake_data'))}
                            description={t('customer:fake_data_helper')}
                          />
                          <RadioButton
                            icon={Minus}
                            value={0}
                            text={(t('customer:no_use_fake_data'))}
                            description={t('customer:no_use_fake_data_helper')}
                          />
                        </RadioButtonGroup>
                      )}
                      control={form.control}
                      defaultValue={1}
                    />

                  </FormControl>
                )}
              </InputGrid>
            </Div>
          </FormSection>
        </>
      )}

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

export default CustomerForm;
