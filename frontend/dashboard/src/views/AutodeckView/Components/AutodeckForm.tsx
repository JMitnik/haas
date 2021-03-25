import { Briefcase, Link } from 'react-feather';
import { useGetPreviewDataLazyQuery, useGetJobProcessLocationsQuery } from 'types/generated-types';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { useForm, Controller } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import cuid from 'cuid';
import Select from 'react-select';

import boolToInt from 'utils/booleanToNumber';
import WebsiteScreenshotFragment from '../Fragments/WebsiteScreenshot';
import PrimaryColourFragment from '../Fragments/PrimaryColor';
import CustomerLogoFormFragment from '../Fragments/CustomerLogoFragment';
import PitchdeckFragment from '../Fragments/PitchdeckFragment';
import { FormDataProps, AutodeckFormProps } from '../Types';

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

  const [fetchPreviewData, { data: previewData }] = useGetPreviewDataLazyQuery()
  const { data: jobProcessLocations } = useGetJobProcessLocationsQuery()

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

  const { setValue } = form

  const onFormSubmit = (data: FormDataProps) => {
    const requiresRembgLambda = data?.useRembg === 1 ? true : false;
    const requiresColorExtraction = data?.useCustomColour === 1 ? true : false;
    const requiresWebsiteScreenshot = data?.useWebsiteUrl === 1 ? true : false;
    const usesAdjustedLogo = data?.isEditingLogo === 1 ? true : false;
    const jobLocationId = data.jobLocation?.value

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
            primaryColour: data.primaryColour,
            usesAdjustedLogo: false,
            jobLocationId
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
          jobLocationId
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
  }, [job, fetchPreviewData])

  useEffect(() => {
    if (!previewData) return;
    console.log('Setting preview data!')
    setValue('uploadLogo', previewData?.getPreviewData?.rembgLogoUrl);
    setValue('uploadWebsite', previewData?.getPreviewData?.websiteScreenshotUrl);
    setValue('primaryColour', previewData?.getPreviewData?.colors[0])
  }, [previewData, setValue])

  const mappedJobLocations = jobProcessLocations?.getJobProcessLocations?.jobProcessLocations
    .map((jobLocation) => ({ label: `${jobLocation.name} - ${jobLocation.path}`, value: jobLocation.id }))

  const activeJobLocation = isInEditing && job?.processLocation ? { label: `${job?.processLocation?.name} - ${job?.processLocation?.path}`, value: job?.processLocation?.id } : null

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

              <FormControl isInvalid={!!form.errors.jobLocation} isRequired>
                <FormLabel htmlFor="jobLocation">{t('process_location')}</FormLabel>
                <InputHelper>{t('process_location_helper')}</InputHelper>
                <Controller
                  name="jobLocation"
                  defaultValue={activeJobLocation}
                  control={form.control}
                  render={({ onChange, value }) => (
                    <Select
                      isDisabled={isInEditing}
                      options={mappedJobLocations}
                      value={value}
                      onChange={(opt: any) => {
                        onChange(opt);
                      }}
                    />
                  )}
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
                <PitchdeckFragment form={form} />
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
