import * as yup from 'yup';
import styled from 'styled-components';
import { Briefcase, Clipboard, Link, Link2, Upload, ThumbsDown, ThumbsUp, Play, Pause, AlertCircle } from 'react-feather';
import { useGetPreviewDataLazyQuery, useUploadJobImageMutation, CreateWorkspaceJobMutation, Exact, GenerateAutodeckInput, CreateWorkspaceJobType, ConfirmWorkspaceJobMutation } from 'types/generated-types';
import { Button, ButtonGroup, RadioButtonGroup, useToast } from '@chakra-ui/core';
import { Controller, UseFormMethods, useForm } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted,
  RadioButton,
  RadioButtons,
  Flex,
} from '@haas/ui';
import { useHistory } from 'react-router';
import { MutationFunctionOptions } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import cuid from 'cuid';

import ColorPickerInput from 'components/ColorPicker';

import FileDropInput from 'components/FileDropInput';

import { DeepPartial } from 'types/customTypes';
import { useEffect } from 'react';
import boolToInt from 'utils/booleanToNumber';

const CustomerUploadLogoInput = ({ onChange, value, jobId, imageType, isInEditing, isDisapproved }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useUploadJobImageMutation({
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
      onChange(result.uploadJobImage?.url);
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
  })

  const onDrop = (files: File[]) => {
    if (!files.length) return;
    onChange('');
    const [file] = files;
    const disapproved: boolean = isDisapproved || false
    uploadFile({ variables: { file, jobId, type: imageType, disapproved } });
  };

  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value])

  return (
    <>
      <FileDropInput isInEditing={isInEditing} value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

const WebsiteScreenshotFragment = ({ form, jobId, isInEditing }: {
  form: UseFormMethods<FormDataProps>, jobId: string, isInEditing: boolean,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {!isInEditing &&
        <FormControl>
          <FormLabel>{t('website_screenshot')}</FormLabel>
          <InputHelper>{t('website_screenshot_subtext')}</InputHelper>
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
      }


      {!isInEditing && form.watch('useWebsiteUrl') === 1 && (
        <FormControl isInvalid={!!form.errors.website} isRequired>
          <FormLabel htmlFor="website">{t('autodeck:website')}</FormLabel>
          <InputHelper>{t('autodeck:website_helper')}</InputHelper>
          <Input
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            leftEl={<Link />}
            name="website"
            ref={form.register()}
          />
        </FormControl>

      )}  {!isInEditing && form.watch('useWebsiteUrl') === 0 && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadWebsite"
              defaultValue=""
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="WEBSITE_SCREENSHOT" />
              )}
            />
          </FormControl>
        </>
      )}

      {isInEditing && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadWebsite"
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput
                  isInEditing={isInEditing && form.watch('isWebsiteUrlApproved') === 1}
                  jobId={jobId} value={value}
                  onChange={onChange}
                  imageType="WEBSITE_SCREENSHOT"
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{'Website screenshot approval'}</FormLabel>
            <InputHelper>{'Approve or edit the website screenshot used for document generation'}</InputHelper>
            <Controller
              control={form.control}
              name="isWebsiteUrlApproved"
              defaultValue={1}
              render={({ onChange, value }) => (
                <RadioButtonGroup
                  value={value}
                  isInline
                  onChange={onChange}
                  display="flex"
                >
                  <RadioButton icon={ThumbsUp} value={1} text={'Approve'} description={'Use current website screenshot'} />
                  <RadioButton icon={ThumbsDown} value={0} text={'Edit'} description={'Upload new website screenshot'} />
                </RadioButtonGroup>
              )}
            />
          </FormControl>
        </>
      )}
    </>
  );
};

const ColorEntry = styled(Flex) <{ isSelected: boolean }>`
  cursor: pointer;
  padding: 20px 40px;
  border-radius: 9px;
  align-items: center;
  box-shadow: ${props => props.isSelected ? 'rgba(0, 0, 0, 0.20) 0px 4px 12px;' : 'none'};
`

const ColourContainer = styled(Flex) <{ isSelected: boolean }>`
  cursor: pointer;
  border: ${props => props.isSelected ? '1px solid' : 'none'};
  border-radius: ${props => props.isSelected ? '9px' : 'none'};
  padding: 10px;
  align-items: center;
  flex-direction: column;
`

const ColorPaletteFragment = ({ form, onChange, value, palette }:
  { form: UseFormMethods<FormDataProps>, onChange: any, value: any, palette: Array<string> }) => {
  const [currColor, setCurrColor] = useState(palette[0])

  useEffect(() => {
    setCurrColor(palette[0])
  }, [palette])

  const handleColorChange = (color: string) => {
    setCurrColor(color)
    onChange(color)
  }

  return (
    <Flex flexDirection="row" justifyContent="space-around">
      {palette.map((color) => (
        <ColourContainer
          isSelected={color === currColor}
          key={color}
          onClick={() => handleColorChange(color)}>
          <ColorEntry
            isSelected={color === currColor}
            backgroundColor={color}>
          </ColorEntry>
          <span style={{ fontWeight: color === currColor ? 500 : 'normal' }}>{color}</span>
        </ColourContainer>

      ))}
    </Flex>
  )
}

const PrimaryColourFragment = ({ form, isInEditing, palette }: { form: UseFormMethods<FormDataProps>, isInEditing: boolean, palette: Array<string> }) => {
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

      {form.watch('useCustomColour') === 1 && isInEditing && (
        <FormControl>
          <FormLabel htmlFor="primaryColour">{t('branding_color')}</FormLabel>
          <InputHelper>{t('customer:branding_color_helper')}</InputHelper>
          <Controller
            control={form.control}
            name="primaryColour"
            defaultValue="#BEE3F8"
            render={({ onChange, value }) => (
              <ColorPaletteFragment palette={palette} form={form} onChange={onChange} value={value} />
            )}
          />
        </FormControl>
      )}

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

const CustomerLogoFormFragment = ({ form, jobId, previewLogo, isInEditing }: { form: UseFormMethods<FormDataProps>, jobId: string, previewLogo: string, isInEditing: boolean }) => {
  const { t } = useTranslation();

  return (
    <>
      {!isInEditing && (
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
      )}


      {!isInEditing && form.watch('useCustomUrl') === 1 && (
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

      )}
      {!isInEditing && form.watch('useCustomUrl') === 0 && (
        <>
          <FormControl>
            <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
            <InputHelper>{t('logo_upload_helper')}</InputHelper>

            <Controller
              control={form.control}
              name="uploadLogo"
              defaultValue={previewLogo || ""}
              render={({ onChange, value }) => (
                <CustomerUploadLogoInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="LOGO" />
              )}
            />
          </FormControl>
        </>
      )}

      {isInEditing && (
        <>
        <FormControl>
          <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
          <InputHelper>{t('logo_upload_helper')}</InputHelper>

          <Controller
            control={form.control}
            name="uploadLogo"
            defaultValue={previewLogo || ""}
            render={({ onChange, value }) => (
              <CustomerUploadLogoInput isDisapproved={form.watch('isLogoUrlApproved') === 0} isInEditing={isInEditing && form.watch('isLogoUrlApproved') === 1} jobId={jobId} value={value} onChange={onChange} imageType="LOGO" />
            )}
          />
          {form.watch('isLogoUrlApproved') === 0 && (
            <Flex marginTop="5px">
              <Div width="auto" color="orange">
                <AlertCircle color="orange" />
              </Div>
              <Div marginLeft="5px">The newly uploaded logo will <span style={{fontWeight: 'bold'}}>override</span> the currently used logo and <span style={{fontWeight: 'bold'}}>no background removal</span> will be performed.</Div>
            </Flex>
          )}
        </FormControl>
        <FormControl>
            <FormLabel>{'Website screenshot approval'}</FormLabel>
            <InputHelper>{'Approve or edit the website screenshot used for document generation'}</InputHelper>
            <Controller
              control={form.control}
              name="isLogoUrlApproved"
              defaultValue={1}
              render={({ onChange, value }) => (
                <RadioButtonGroup
                  value={value}
                  isInline
                  onChange={onChange}
                  display="flex"
                >
                  <RadioButton icon={ThumbsUp} value={1} text={'Approve'} description={'Use current logo'} />
                  <RadioButton icon={ThumbsDown} value={0} text={'Edit'} description={'Upload new logo'} />
                </RadioButtonGroup>
              )}
            />
          
          </FormControl>
        </>
      )}

      {!isInEditing && (
        <FormControl>
          <FormLabel>{t('logo')}</FormLabel>
          <InputHelper>{t('customer:logo_helper')}</InputHelper>

          <Controller
            control={form.control}
            name="useRembg"
            render={({ onChange, value }) => (
              <RadioButtonGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={Play} value={1} text={t('autodeck:use_rembg')} description={t('autodeck:use_rembg_helper')} />
                <RadioButton icon={Pause} value={0} text={t('autodeck:original_image')} description={t('autodeck:original_image_helper')} />
              </RadioButtonGroup>
            )}
          />

        </FormControl>
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
  useRembg: yup.number(),
  useCustomUrl: yup.number(),
  useCustomColour: yup.number(),
  useWebsiteUrl: yup.number(),
  isWebsiteUrlApproved: yup.number(),
  isLogoUrlApproved: yup.number(),
  uploadLogo: yup.string().url(),
  firstName: yup.string(),
  answer1: yup.string(),
  answer2: yup.string(),
  answer3: yup.string(),
  answer4: yup.string(),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

interface AutodeckFormProps {
  onClose: () => void;
  isLoading: boolean;
  onCreateJob: (options?: MutationFunctionOptions<CreateWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  job: DeepPartial<CreateWorkspaceJobType> | null;
  isInEditing: boolean;
  onConfirmJob: (options?: MutationFunctionOptions<ConfirmWorkspaceJobMutation, Exact<{
    input?: GenerateAutodeckInput | null | undefined;
  }>> | undefined) => Promise<any>;
  isConfirmLoading: boolean;
}

const AutodeckForm = ({
  onClose,
  isLoading,
  onCreateJob,
  job,
  isInEditing,
  onConfirmJob,
  isConfirmLoading
}: AutodeckFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [activeJobId, setActiveJobId] = useState(cuid());

  const [fetchPreviewData, { data: previewData, loading: previewLoading }] = useGetPreviewDataLazyQuery()

  const form = useForm<FormDataProps>({
    defaultValues: {
      useCustomUrl: 0,
      useCustomColour: boolToInt(job?.requiresColorExtraction) || 1,
      useWebsiteUrl: isInEditing ? 0 : 1,
      useRembg: 1,
      name: job?.name,
    },
    mode: 'all'
  });

  const onFormSubmit = (data: FormDataProps) => {
    const requiresRembgLambda = data?.useRembg === 1 ? true : false;
    const requiresColorExtraction = data?.useCustomColour === 1 ? true : false;
    const requiresWebsiteScreenshot = data?.useWebsiteUrl === 1 ? true : false;

    if (!isInEditing && (requiresRembgLambda || requiresColorExtraction || requiresWebsiteScreenshot)) {
      return onCreateJob({
        variables: {
          input: {
            id: activeJobId,
            name: data.name,
            logo: data.logo || data.uploadLogo,
            website: data.website,
            requiresRembgLambda,
            requiresWebsiteScreenshot,
            requiresColorExtraction,
            primaryColour: data.primaryColour
          }
        }
      })
    }
    onConfirmJob({
      variables: {
        input: {
          id: job?.id || activeJobId || '',
          name: data.name,
          answer1: data.answer1,
          answer2: data.answer2,
          answer3: data.answer3,
          answer4: data.answer4,
          firstName: data.firstName,
          requiresRembgLambda,
          requiresWebsiteScreenshot,
          requiresColorExtraction,
          primaryColour: data.primaryColour,
        }
      }
    })
  }

  useEffect(() => {
    const jobId = job?.id;
    if (!jobId) return;
    fetchPreviewData({
      variables: {
        id: jobId,
      }
    });
  }, [job])

  useEffect(() => {
    if (!previewData) return;
    form.setValue('uploadLogo', previewData?.getPreviewData?.rembgLogoUrl);
    form.setValue('uploadWebsite', previewData?.getPreviewData?.websiteScreenshotUrl);
    form.setValue('primaryColour', previewData?.getPreviewData?.colors[0])
  }, [previewData])

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
      <>
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
                <FormLabel htmlFor="name">{t('job_name')}</FormLabel>
                <InputHelper>{t('job_name_helper')}</InputHelper>
                <Input
                  isDisabled={isInEditing}
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
            <H3 color="default.text" fontWeight={500} pb={2}>{t('logo_manipulation')}</H3>
            <Muted color="gray.600">
              {t('logo_manipulation_helper')}
            </Muted>
          </Div>
          <Div>
            <InputGrid>
              <CustomerLogoFormFragment isInEditing={isInEditing} previewLogo={previewData?.getPreviewData?.rembgLogoUrl || ''} jobId={job?.id || activeJobId} form={form} />
            </InputGrid>
            <Hr />
            <InputGrid>
              <PrimaryColourFragment palette={previewData?.getPreviewData?.colors || []} isInEditing={isInEditing} form={form} />
            </InputGrid>
          </Div>
        </FormSection>

        <Hr />
        <FormSection id="website">
          <Div>
            <H3 color="default.text" fontWeight={500} pb={2}>{t('website_screenshot')}</H3>
            <Muted color="gray.600">
              {t('website_screenshot_helper')}
            </Muted>
          </Div>
          <Div>
            <InputGrid>
              <WebsiteScreenshotFragment isInEditing={isInEditing} jobId={job?.id || activeJobId} form={form} />
            </InputGrid>
          </Div>
        </FormSection>
      </>

      {(isInEditing
        || (form.watch('useRembg') === 0
          && form.watch('useWebsiteUrl') === 0
          && form.watch('useCustomColour') === 0))
        &&
        <>
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
        </>
      }

      <ButtonGroup>
        <Button
          isLoading={isLoading || isConfirmLoading}
          isDisabled={!form.formState.isValid}
          variantColor="teal"
          type="submit"
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => onClose()}>{t('cancel')}</Button>
      </ButtonGroup>
    </Form>
  );
};

export default AutodeckForm;
