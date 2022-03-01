import { Clipboard, Link2 } from 'react-feather';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel } from '@chakra-ui/core';
import { InputHelper, RadioButton, RadioButtons } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import ColorPickerInput from 'components/ColorPicker';

import ColorPaletteFragment from './ColorPalette';

const PrimaryColourFragment = ({ form, isInEditing, palette }: {
  form: any, isInEditing: boolean, palette: Array<string>
}) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl>
        <FormLabel>{t('autodeck:primary_color')}</FormLabel>
        <InputHelper>{t('autodeck:primary_color_helper')}</InputHelper>

        <Controller
          control={form.control}
          key="customer_color_controller"
          name="useCustomColour"
          render={({ field }) => (
            <RadioButtons
              value={field.value}
              key="customer_color_key"
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              <RadioButton
                icon={Link2}
                value={1}
                text={t('autodeck:logo_color')}
                description={t('autodeck:logo_color_helper')}
              />
              <RadioButton
                icon={Clipboard}
                value={0}
                text={t('autodeck:custom_color')}
                description={t('autodeck:custom_color_helper')}
              />
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
            defaultValue={palette?.[0] || '#BEE3F8'}
            render={({ field }) => (
              <ColorPaletteFragment palette={palette} form={form} onChange={field.onChange} value={field.value} />
            )}
          />
        </FormControl>
      )}

      {form.watch('useCustomColour') === 0
        && (
          <>
            <FormControl isInvalid={!!form.formState.errors.primaryColour} isRequired>
              <FormLabel htmlFor="primaryColour">{t('branding_color')}</FormLabel>
              <InputHelper>{t('customer:branding_color_helper')}</InputHelper>
              <Controller
                control={form.control}
                name="primaryColour"
                defaultValue="#BEE3F8"
                render={({ field }) => <ColorPickerInput {...field} />}
              />
            </FormControl>
          </>
        )}
    </>
  );
};

export default PrimaryColourFragment;
