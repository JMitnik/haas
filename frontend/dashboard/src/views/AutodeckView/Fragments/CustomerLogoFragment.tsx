import { Link, Link2, Upload, ThumbsDown, ThumbsUp, Play, Pause, AlertCircle, Edit2, UploadCloud } from 'react-feather';
import { RadioGroup } from '@chakra-ui/react';
import { Controller, UseFormMethods } from 'react-hook-form';
import {
  Div, FormControl, FormLabel, Input, InputHelper,
  RadioButton,
  Flex,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';


import Canvas from '../Components/Canvas';
import UploadImageInput from '../Fragments/UploadImageInput';
import { FormDataProps } from '../Types';

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
              <RadioGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={<Link2 />} value={1} text={t('existing_url')} description={t('existing_url_helper')} />
                <RadioButton icon={<Upload />} value={0} text={t('upload_file')} description={t('upload_file_helper')} />
              </RadioGroup>
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
                <UploadImageInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="LOGO" />
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
                <UploadImageInput
                  isDisapproved={form.watch('isLogoUrlApproved') === 0}
                  isInEditing={form.watch('isEditingLogo') !== 0}
                  jobId={jobId}
                  value={value}
                  onChange={onChange}
                  imageType="LOGO"
                />
              )}
            />
            {form.watch('isEditingLogo') === 0 && (
              <Flex marginTop="5px">
                <Div width="auto" color="orange">
                  <AlertCircle color="orange" />
                </Div>
                <Div marginLeft="5px">The newly uploaded logo will <span style={{ fontWeight: 'bold' }}>override</span> the currently used logo and <span style={{ fontWeight: 'bold' }}>no background removal</span> will be performed.</Div>
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
                <RadioGroup
                  value={value}
                  isInline
                  onChange={onChange}
                  display="flex"
                >
                  <RadioButton icon={<ThumbsUp />} value={1} text={'Approve'} description={'Use current logo'} />
                  <RadioButton icon={<ThumbsDown />} value={0} text={'Edit'} description={'Use different logo'} />
                </RadioGroup>
              )}
            />

          </FormControl>
          {form.watch('isLogoUrlApproved') === 0 && (
            <FormControl>
              <FormLabel>Edit current logo</FormLabel>
              <InputHelper>{'Upload new logo or edit the current logo'}</InputHelper>
              <Controller
                control={form.control}
                name="isEditingLogo"
                defaultValue={0}
                render={({ onChange, value }) => (
                  <RadioGroup
                    value={value}
                    isInline
                    onChange={onChange}
                    display="flex"
                  >
                    <RadioButton icon={<UploadCloud />} value={0} text={'Upload'} description={'Upload new logo'} />
                    <RadioButton icon={<Edit2 />} value={1} text={'Edit'} description={'Edit current logo'} />
                  </RadioGroup>
                )}
              />

            </FormControl>
          )}

          {form.watch('isEditingLogo') === 1 && (
            <FormControl>
              <FormLabel htmlFor="cloudinary">Logo adjustment</FormLabel>
              <Controller
                control={form.control}
                name="adjustedLogo"
                defaultValue=""
                render={({ onChange, value }) => (
                  <Canvas id={jobId} onChange={onChange} value={value} />
                )}
              />
            </FormControl>
          )}
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
              <RadioGroup
                value={value}
                isInline
                onChange={onChange}
                display="flex"
              >
                <RadioButton icon={<Play />} value={1} text={t('autodeck:use_rembg')} description={t('autodeck:use_rembg_helper')} />
                <RadioButton icon={<Pause />} value={0} text={t('autodeck:original_image')} description={t('autodeck:original_image_helper')} />
              </RadioGroup>
            )}
          />

        </FormControl>
      )}

    </>
  );
};

export default CustomerLogoFormFragment
