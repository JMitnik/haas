import { UseFormMethods, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React from "react";
import { FormControl, FormLabel, RadioButtonGroup } from "@chakra-ui/core";
import { InputHelper, RadioButton, Input } from "@haas/ui";
import { Link2, Upload, Link, ThumbsUp, ThumbsDown } from "react-feather";
import UploadImageInput from "./UploadImageInput";
import { FormDataProps } from "../Types";

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
                <UploadImageInput isInEditing={isInEditing} jobId={jobId} value={value} onChange={onChange} imageType="WEBSITE_SCREENSHOT" />
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
              defaultValue=""
              render={({ onChange, value }) => (
                <UploadImageInput
                  value={value}
                  isInEditing={isInEditing && form.watch('isWebsiteUrlApproved') === 1}
                  jobId={jobId}
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

export default WebsiteScreenshotFragment
