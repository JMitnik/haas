import * as UI from '@haas/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, useToast } from '@chakra-ui/core';
import { Controller, useFieldArray } from 'react-hook-form';
import { PlusCircle, Type } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useUploadUpsellImageMutation } from 'types/generated-types';
import FileDropInput from 'components/FileDropInput';
import React from 'react';
import Select from 'react-select';

import { ReactComponent as NoDataIll } from 'assets/images/undraw_no_data.svg';
import { useCustomer } from 'providers/CustomerProvider';

import { LinkInputProps, LinkSectionHeader } from './CTATypes';

const LINK_TYPES = [
  { label: 'SINGLE', value: 'SINGLE' },
  { label: 'SOCIAL', value: 'SOCIAL' },
  { label: 'API', value: 'API' },
  { label: 'FACEBOOK', value: 'FACEBOOK' },
  { label: 'INSTAGRAM', value: 'INSTAGRAM' },
  { label: 'LINKEDIN', value: 'LINKEDIN' },
  { label: 'TWITTER', value: 'TWITTER' },
  { label: 'WHATSAPP', value: 'WHATSAPP' },
];

const ImageUploadLogoInput = ({ onChange, value }: any) => {
  const toast = useToast();
  const { activeCustomer } = useCustomer();

  const [uploadFile, { loading }] = useUploadUpsellImageMutation({
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
      onChange(result?.uploadUpsellImage?.url);
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
    uploadFile({ variables: { input: { file, workspaceId: activeCustomer?.id } } });
  };

  return (
    <>
      <FileDropInput value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

interface LinkOverviewProps {
  form: any;
}

const LinksOverview = ({ form }: LinkOverviewProps) => {
  const { t } = useTranslation();
  const { fields: linkFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'links',
    keyName: 'fieldIndex',
  });

  const appendNewField = (): LinkInputProps => ({
    title: '',
    url: '',
    backgroundColor: '',
    buttonText: '',
    header: '',
    iconUrl: '',
    imageUrl: '',
    subHeader: '',
    type: null,
  });

  const linkType = form.watch('links[0].type');

  return (
    <>
      <UI.FormSection id="links">
        <UI.Div>
          <UI.FormSectionHeader>Links</UI.FormSectionHeader>
          <UI.FormSectionHelper>{t('cta:link_header')}</UI.FormSectionHelper>
        </UI.Div>
        <UI.Div>
          <UI.InputGrid>
            <UI.Div gridColumn="1 / -1">
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
                <UI.H4>Links</UI.H4>
                <Button
                  leftIcon={PlusCircle}
                  onClick={() => append(appendNewField())}
                  size="sm"
                >
                  {t('cta:add_link')}

                </Button>
              </Flex>
              <UI.Hr />
              {linkFields.length === 0 && (

                <UI.IllustrationCard isFlat svg={<NoDataIll />} text={t('no_data')} />
              )}
              <AnimatePresence>
                {linkFields.map((link: any, index) => (
                  <motion.div key={(`${link.id}` || link.url)} initial={{ opacity: 1 }} exit={{ opacity: 0, x: 100 }}>
                    <UI.Div
                      position="relative"
                      key={link.fieldIndex}
                      marginTop={15}
                      gridColumn="1 / -1"
                      bg="gray.100"
                      padding={4}
                    >
                      <Grid
                        gridGap="12px"
                        gridTemplateColumns={['1fr 1fr']}
                      >

                        <LinkSectionHeader title="General" />
                        <FormControl isRequired isInvalid={!!form.formState.errors?.links?.[index]?.url}>
                          <FormLabel htmlFor={`links[${index}].url`}>{t('cta:url')}</FormLabel>
                          <UI.InputHelper>{t('cta:link_url_helper')}</UI.InputHelper>
                          <UI.Input
                            defaultValue={link.url}
                            placeholder="https://link.to/"
                            leftEl={<Type />}
                            {...form.register(`links[${index}].url`, { required: true })}
                          />
                          <FormErrorMessage>{!!form.formState.errors?.links?.[index]?.url?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!form.formState.errors.links?.[index]?.type}>
                          <FormLabel htmlFor={`links[${index}].type`}>{t('cta:type')}</FormLabel>
                          <UI.InputHelper>{t('cta:link_type_helper')}</UI.InputHelper>
                          <Controller
                            // TODO: Look how to add back id={`link-${link.id}-${index}`}
                            name={`links[${index}].type`}
                            control={form.control}
                            defaultValue={link.type}
                            render={({ field }) => {
                              const data = { label: field.value, value: field.value?.value };
                              return (
                                <Select
                                  options={LINK_TYPES}
                                  value={data}
                                  onChange={(opt: any) => {
                                    field.onChange(opt.value);
                                  }}
                                />
                              );
                            }}
                          />
                          <FormErrorMessage>{!!form.formState.errors.links?.[index]?.type?.message}</FormErrorMessage>
                        </FormControl>

                        {linkType === 'SINGLE' && (
                          <>
                            <LinkSectionHeader title="Content (Single link only)" />

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].header`}>{t('cta:upsell_header')}</FormLabel>
                              <UI.InputHelper>{t('cta:upsell_header_helper')}</UI.InputHelper>
                              <UI.Input
                                isInvalid={!!form.formState.errors.links?.[index]?.header}
                                defaultValue={link.header}
                                {...form.register(`links[${index}].header`, { required: false })}
                              />
                              <FormErrorMessage>
                                {!!form.formState.errors.links?.[index]?.header?.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].subHeader`}>{t('cta:upsell_subheader')}</FormLabel>
                              <UI.InputHelper>{t('cta:upsell_subheader_helper')}</UI.InputHelper>
                              <UI.Input
                                isInvalid={!!form.formState.errors.links?.[index]?.subHeader}
                                defaultValue={link.subHeader}
                                {...form.register(`links[${index}].subHeader`, { required: false })}
                              />
                              <FormErrorMessage>
                                {!!form.formState.errors.links?.[index]?.subHeader?.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="cloudinary">{t('cta:link_header_image')}</FormLabel>
                              <UI.InputHelper>{t('cta:link_header_image_helper')}</UI.InputHelper>

                              <Controller
                                control={form.control}
                                name={`links[${index}].imageUrl`}
                                defaultValue={link.imageUrl}
                                render={({ field }) => (
                                  <ImageUploadLogoInput
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </FormControl>
                          </>
                        )}

                        <LinkSectionHeader title="Button" />

                        <FormControl>
                          <FormLabel htmlFor={`links[${index}].title`}>{t('cta:link_tooltip')}</FormLabel>
                          <UI.InputHelper>{t('cta:link_tooltip_helper')}</UI.InputHelper>
                          <UI.Input
                            isInvalid={!!form.formState.errors.links?.[index]?.title}
                            defaultValue={link.title}
                            {...form.register(`links[${index}].title`, { required: false })}
                          />
                          <FormErrorMessage>{!!form.formState.errors.links?.[index]?.title?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor={`links[${index}].iconUrl`}>{t('cta:link_icon')}</FormLabel>
                          <UI.InputHelper>{t('cta:link_icon_helper')}</UI.InputHelper>
                          <UI.Input
                            isInvalid={!!form.formState.errors.links?.[index]?.iconUrl}
                            defaultValue={link.iconUrl}
                            {...form.register(`links[${index}].iconUrl`, { required: false })}
                          />
                          <FormErrorMessage>
                            {!!form.formState.errors.links?.[index]?.iconUrl?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor={`links[${index}].backgroundColor`}>{t('cta:background_color')}</FormLabel>
                          <UI.InputHelper>{t('cta:background_color_helper')}</UI.InputHelper>
                          <UI.Input
                            isInvalid={!!form.formState.errors.links?.[index]?.backgroundColor}
                            defaultValue={link.backgroundColor}
                            {...form.register(`links[${index}].backgroundColor`, { required: false })}
                          />
                          <FormErrorMessage>
                            {!!form.formState.errors.links?.[index]?.backgroundColor?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor={`links[${index}].buttonText`}>{t('cta:redirect_button_text')}</FormLabel>
                          <UI.InputHelper>{t('cta:redirect_button_text_helper')}</UI.InputHelper>
                          <UI.Input
                            isInvalid={!!form.formState.errors.links?.[index]?.buttonText}
                            defaultValue={link.buttonText}
                            {...form.register(`links[${index}].buttonText`, { required: false })}
                          />
                          <FormErrorMessage>
                            {!!form.formState.errors.links?.[index]?.buttonText?.message}
                          </FormErrorMessage>
                        </FormControl>

                      </Grid>
                      <Button
                        mt={4}
                        variant="outline"
                        size="sm"
                        variantColor="red"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        {t('cta:delete_link')}
                      </Button>
                    </UI.Div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </UI.Div>
          </UI.InputGrid>
        </UI.Div>
      </UI.FormSection>
    </>
  );
};

export default LinksOverview;
