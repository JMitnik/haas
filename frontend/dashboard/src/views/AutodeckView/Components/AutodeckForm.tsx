import { Briefcase, Link, Trash2, ThumbsUp, ThumbsDown } from 'react-feather';
import { useGetPreviewDataLazyQuery, useGetJobProcessLocationsQuery, JobProcessLocationType } from 'types/generated-types';
import { Button, ButtonGroup, RadioButtonGroup } from '@chakra-ui/core';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper, Textarea,
  Muted,
  RadioButton,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import cuid from 'cuid';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers';
import boolToInt from 'utils/booleanToNumber';

import WebsiteScreenshotFragment from '../Fragments/WebsiteScreenshot';
import PrimaryColourFragment from '../Fragments/PrimaryColor';
import CustomerLogoFormFragment from '../Fragments/CustomerLogoFragment';
import PitchdeckFragment from '../Fragments/PitchdeckFragment';
import { FormDataProps, AutodeckFormProps, schema } from '../Types';

const AutodeckForm = ({
  onClose,
  isLoading,
  onCreateJob,
  job,
  isInEditing,
  onConfirmJob,
  isConfirmLoading
}: AutodeckFormProps) => {
  const { t } = useTranslation();
  const [activeJobId] = useState(cuid());
  const [activeTemplateType, setActiveTemplateType] = useState<JobProcessLocationType | undefined>(undefined)
  const [fetchPreviewData, { data: previewData }] = useGetPreviewDataLazyQuery()
  const { data: jobProcessLocations } = useGetJobProcessLocationsQuery()

  const form = useForm<FormDataProps>({
    defaultValues: {
      useCustomUrl: 0,
      useCustomColour: boolToInt(job?.requiresColorExtraction) || 1,
      useWebsiteUrl: isInEditing ? 0 : 1,
      useRembg: 1,
      name: job?.name || '',
      customFields: job?.processLocation?.customFields || [],
      newCustomFields: []
    },
    mode: 'all',
    shouldFocusError: true,
    resolver: yupResolver(schema)
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "customFields",
    keyName: 'arrayKey'
  });

  const { fields: newCustomFields, append, remove } = useFieldArray({
    control: form.control,
    name: "newCustomFields",
    keyName: 'arrayKey'
  });

  const { setValue } = form;

  const onFormSubmit = (data: FormDataProps) => {
    const requiresRembgLambda = data?.useRembg === 1 ? true : false;
    const requiresColorExtraction = data?.useCustomColour === 1 ? true : false;
    const requiresWebsiteScreenshot = data?.useWebsiteUrl === 1 ? true : false;
    const usesAdjustedLogo = data?.isEditingLogo === 1 ? true : false;
    const jobLocationId = data.jobLocation?.value

    const mappedStandardFields = Object.entries(data)
      .filter((obj) => typeof obj[1] === 'string')
      .map((obj) => ({ key: obj[0], value: obj[1] }))
    const mappedCustomFields = data.customFields?.map((field) => ({ key: field?.key, value: field?.value })) || [];
    const mappedNewCustomFields = data.newCustomFields?.map((field) => {
      return { key: field?.key, value: field?.value }
    })

    const isGenerateWorkspace = data.isGenerateWorkspace === 1 ? true : false;

    console.log('Submit data: ', data)

    if (!isInEditing && (requiresRembgLambda || requiresColorExtraction || requiresWebsiteScreenshot)) {
      return onCreateJob({
        variables: {
          input: {
            id: activeJobId,
            name: data.name,
            logo: data.logo || data.uploadLogo,
            primaryColour: data.primaryColour,
            website: data.website,
            requiresRembgLambda,
            requiresWebsiteScreenshot,
            requiresColorExtraction,
            usesAdjustedLogo: false,
            jobLocationId,
          }
        }
      })
    }
    onConfirmJob({
      variables: {
        input: {
          id: job?.id || activeJobId || '',
          name: data.name,
          requiresRembgLambda,
          requiresWebsiteScreenshot,
          requiresColorExtraction,
          firstName: data.firstName,
          companyName: data.companyName,
          answer1: data.answer1,
          answer2: data.answer2,
          answer3: data.answer3,
          answer4: data.answer4,
          primaryColour: data.primaryColour,
          usesAdjustedLogo: usesAdjustedLogo,
          sorryAboutX: data?.sorryAboutX,
          youLoveX: data.youLoveX,
          reward: data.reward,
          emailContent: data.emailContent,
          textMessage: data.textMessage,
          jobLocationId,
          standardFields: mappedStandardFields,
          customFields: mappedCustomFields || [],
          newCustomFields: mappedNewCustomFields || [],
          slug: data.slug,
          isGenerateWorkspace: isGenerateWorkspace
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
  }, [job, fetchPreviewData]);

  useEffect(() => {
    if (!previewData) return;
    setValue('uploadLogo', previewData?.getPreviewData?.rembgLogoUrl);
    setValue('uploadWebsite', previewData?.getPreviewData?.websiteScreenshotUrl);
    setValue('primaryColour', previewData?.getPreviewData?.colors[0]);
  }, [previewData, setValue]);

  const mappedJobLocations = jobProcessLocations?.getJobProcessLocations?.jobProcessLocations
    .map((jobLocation) => ({ label: `${jobLocation.name} - ${jobLocation.path}`, value: jobLocation.id }))

  const activeJobLocation = isInEditing && job?.processLocation ? { label: `${job?.processLocation?.name} - ${job?.processLocation?.path}`, value: job?.processLocation?.id } : null

  const handleJobLocationChange = (id: string) => {
    const jobLocation = jobProcessLocations?.getJobProcessLocations?.jobProcessLocations.find((location) => location.id === id);
    form.setValue('customFields', jobLocation?.customFields || []);
    return setActiveTemplateType(jobLocation?.type);
  }

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
                  defaultValue={'job'}
                  name="name"
                  ref={form.register()}
                />
              </FormControl>

              {(isInEditing
                || (form.watch('useRembg') === 0
                  && form.watch('useWebsiteUrl') === 0
                  && form.watch('useCustomColour') === 0)) &&
                <>
                  <FormControl>
                    <FormLabel>{'Generate workspace'}</FormLabel>
                    <InputHelper>{'Should a workspace be generated based on current content'}</InputHelper>
                    <Controller
                      control={form.control}
                      name="isGenerateWorkspace"
                      defaultValue={0}
                      render={({ onChange, value }) => (
                        <RadioButtonGroup
                          value={value}
                          isInline
                          onChange={onChange}
                          display="flex"
                        >
                          <RadioButton icon={ThumbsUp} value={1} text={'Yes'} description={'Generate workspace'} />
                          <RadioButton icon={ThumbsDown} value={0} text={'No'} description={'Do not generate workspace'} />
                        </RadioButtonGroup>
                      )}
                    />

                  </FormControl>

                  {form.watch('isGenerateWorkspace') === 1 &&
                    <>
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
                    </>
                  }
                </>
              }

              <FormControl isInvalid={!!form.errors.jobLocation} isRequired>
                <FormLabel htmlFor="jobLocation">{t('process_location')}</FormLabel>
                <InputHelper>{t('process_location_helper')}</InputHelper>
                <Controller
                  name="jobLocation"
                  defaultValue={activeJobLocation}
                  control={form.control}
                  render={({ onChange, value }) => (
                    <Select
                      styles={!!form.errors.jobLocation ? {
                        control: base => ({
                          ...base,
                          border: '1px solid red',
                          '&:hover': {
                            border: '1px solid red',
                          }
                        })
                      } : undefined}
                      isDisabled={isInEditing}
                      options={mappedJobLocations}
                      value={value}
                      onChange={(opt: any) => {
                        onChange(opt);
                        handleJobLocationChange(opt?.value)
                      }}
                    />
                  )}
                />
                {form.errors.jobLocation && <span style={{ color: 'red', marginTop: '5px' }}>Please select job type</span>}
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

      {((job?.processLocation?.type === "PITCHDECK"
      || job?.processLocation?.type === "BROCHURE"
      || activeTemplateType === JobProcessLocationType.Pitchdeck
      || activeTemplateType === JobProcessLocationType.Brochure)
      && (isInEditing
        || (form.watch('useRembg') === 0
          && form.watch('useWebsiteUrl') === 0
          && form.watch('useCustomColour') === 0)))
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
                <PitchdeckFragment form={form} />
              </InputGrid>
            </Div>
          </FormSection>
        </>
      }


      {((job?.processLocation?.type === "ONE_PAGER" || activeTemplateType === JobProcessLocationType.OnePager) && (isInEditing
        || (form.watch('useRembg') === 0
          && form.watch('useWebsiteUrl') === 0
          && form.watch('useCustomColour') === 0)))
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
              </InputGrid>
            </Div>
          </FormSection>
        </>
      }

      {/* If not removing background, not processing website screenshot, and not colour palette, then show fields */}
      {(isInEditing
        || (form.watch('useRembg') === 0
          && form.watch('useWebsiteUrl') === 0
          && form.watch('useCustomColour') === 0))
        &&
        <>
          <Hr />
          <FormSection id="customFields">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>{t('autodeck:custom_fields')}</H3>
              <Muted color="gray.600">
                {t('autodeck:custom_fields_helper')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                {fields.map((customField, index) => {
                  return (
                    <>
                      <input type="hidden" name={`customFields[${index}].key`} defaultValue={fields[index]?.key} ref={form.register()} />
                      <FormControl isInvalid={!!form.errors.customFields?.[index]}>
                        <FormLabel htmlFor={`customFields[${index}].key`}>{fields[index]?.key}</FormLabel>
                        <InputHelper>Fill in a value corresponding with a layer in Photoshop</InputHelper>
                        <Input
                          id={customField.arrayKey}
                          defaultValue=""
                          // eslint-disable-next-line jsx-a11y/anchor-is-valid
                          leftEl={<Link />}
                          name={`customFields[${index}].value`}
                          ref={form.register()}
                        />
                      </FormControl>
                    </>
                  )
                })}

                {newCustomFields.map((newCustomField, index) => {
                  const error: any = form.errors.newCustomFields?.[index]
                  const errorTwo = error?.key?.message
                  return (
                    <Div key={newCustomField.arrayKey} position="relative" borderBottom="1px solid #4f5d6e" borderTop="1px solid #4f5d6e" padding="1em 0">
                      <Div marginBottom="24px">
                        <Div position="absolute" right="5px" style={{ cursor: 'pointer' }} onClick={() => remove(index)}>
                          <Trash2 color="red" />
                        </Div>
                        <FormControl isInvalid={!!form.errors.newCustomFields?.[index]} isRequired>
                          <FormLabel htmlFor="key">Key</FormLabel>
                          <InputHelper>Fill in a key corresponding with a layer in Photoshop</InputHelper>
                          <Input
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            leftEl={<Link />}
                            name={`newCustomFields[${index}].key`}
                            ref={form.register()}
                          />
                          {errorTwo && <span style={{ marginTop: '5px', color: 'red' }}>{errorTwo}</span>}
                        </FormControl>
                      </Div>

                      <FormControl isRequired>
                        <FormLabel htmlFor="value">Value</FormLabel>
                        <InputHelper>Fill in a value a layer in Photoshop should get</InputHelper>
                        <Textarea
                          // eslint-disable-next-line jsx-a11y/anchor-is-valid
                          name={`newCustomFields[${index}].value`}
                          ref={form.register({ required: false })}
                        />
                      </FormControl>
                    </Div>
                  )
                })}
                <Button onClick={() => append({ id: cuid(), key: '', value: '' })}>Add new custom value</Button>

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
