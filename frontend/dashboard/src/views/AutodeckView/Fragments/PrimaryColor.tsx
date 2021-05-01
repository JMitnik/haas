import { UseFormMethods, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React from "react";
import { FormControl, FormLabel } from "@chakra-ui/core";
import { InputHelper, RadioButton, RadioButtons } from "@haas/ui";
import { Link2, Clipboard } from "react-feather";
import { FormDataProps } from "../Types";
import ColorPaletteFragment from "./ColorPalette";
import ColorPickerInput from 'components/ColorPicker';


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
            defaultValue={palette?.[0] || "#BEE3F8"}
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

export default PrimaryColourFragment
