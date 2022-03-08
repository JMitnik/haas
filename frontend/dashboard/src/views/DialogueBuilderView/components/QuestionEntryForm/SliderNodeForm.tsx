import * as UI from '@haas/ui';
import { CheckSquare, Edit, Frown, Smile } from 'react-feather';
import { Controller, useFieldArray } from 'react-hook-form';
import { FormErrorMessage, RadioButtonGroup } from '@chakra-ui/core';
import { RadioButton } from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

/**
 * Slider node form: form-section used in the NodeForm in case current type is a form.
 * Currently renders:
 * - Boundary texts
 * - Markers
 */
const SliderNodeForm = ({ form }: { form: any }) => {
  const { t } = useTranslation();

  const markers = useFieldArray({
    name: 'sliderNode.markers',
    control: form.control,
    keyName: 'fieldIndex',
  });

  const hasCustomerSatisfactionTexts = form.watch('happyText') ? 1 : 0;

  const sliderNodeMarkers = form.watch('sliderNode.markers');

  return (
    <UI.Div>
      <UI.InputGrid>
        <UI.FormControl isRequired isInvalid={!!form.formState.errors.useCustomerSatisfactionTexts}>
          <UI.FormLabel htmlFor="useCustomerSatisfactionTexts">
            {t('dialogue:satisfaction_texts')}
          </UI.FormLabel>
          <UI.InputHelper>
            {t('dialogue:satisfaction_texts_helper')}
          </UI.InputHelper>
          <Controller
            control={form.control}
            name="useCustomerSatisfactionTexts"
            defaultValue={hasCustomerSatisfactionTexts}
            render={({ field }) => (
              <RadioButtonGroup
                value={field.value}
                isInline
                onChange={field.onChange}
                display="flex"
              >
                <RadioButton
                  icon={Edit}
                  value={1}
                  text={t('yes')}
                  description={t('dialogue:use_custom_satisfaction_text')}
                />
                <RadioButton
                  icon={CheckSquare}
                  value={0}
                  text={t('no')}
                  description={t('dialogue:do_not_use_custom_satisfaction_text')}
                />
              </RadioButtonGroup>
            )}
          />
          <FormErrorMessage>{form.formState.errors.useCustomerSatisfactionTexts?.message}</FormErrorMessage>
        </UI.FormControl>
        {form.watch('useCustomerSatisfactionTexts') === 1 && (
          <>
            <UI.FormControl isRequired isInvalid={!!form.formState.errors.unhappyText}>
              <UI.FormLabel htmlFor="unhappyText">
                {t('dialogue:unhappyText')}
              </UI.FormLabel>
              <UI.InputHelper>
                {t('dialogue:unhappyText_helper')}
              </UI.InputHelper>
              <UI.Input
                leftEl={<Frown />}
                {...form.register('unhappyText')}
              />
              <FormErrorMessage>{form.formState.errors.unhappyText?.message}</FormErrorMessage>
            </UI.FormControl>

            <UI.FormControl isRequired isInvalid={!!form.formState.errors.happyText}>
              <UI.FormLabel htmlFor="happyText">
                {t('dialogue:happyText')}
              </UI.FormLabel>
              <UI.InputHelper>
                {t('dialogue:happyText_helper')}
              </UI.InputHelper>
              <UI.Input
                leftEl={<Smile />}
                {...form.register('happyText')}
              />
              <FormErrorMessage>{form.formState.errors.happyText?.message}</FormErrorMessage>
            </UI.FormControl>
          </>
        )}

        <UI.Div>
          <UI.InputHeader>{t('dialogue:markers')}</UI.InputHeader>
          <UI.InputHelper>
            {t('dialogue:markers_helper')}
          </UI.InputHelper>

          {markers.fields.map((marker: any, index) => (
            <UI.Card boxShadow="lg" key={marker.fieldIndex} mb={4} noHover>
              <input {...form.register(`sliderNode.markers[${index}].id`)} type="hidden" defaultValue={marker.id} />
              <UI.CardBody>
                <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr', '1fr 2fr']}>
                  <UI.Div>
                    <UI.Div mb={2}>
                      <UI.FormControl>
                        <UI.FormLabel htmlFor={`sliderNode.markers[${index}].label`}>{t('label')}</UI.FormLabel>
                        <UI.Input {...form.register(`sliderNode.markers[${index}].label`)} size="sm" defaultValue={marker.label} />
                      </UI.FormControl>
                    </UI.Div>
                    <UI.FormControl>
                      <UI.FormLabel htmlFor={`sliderNode.markers[${index}].subLabel`}>{t('sub_label')}</UI.FormLabel>
                      <UI.Input {...form.register(`sliderNode.markers[${index}].subLabel`)} size="sm" defaultValue={marker.subLabel} />
                    </UI.FormControl>
                  </UI.Div>

                  <UI.Div>
                    <UI.RangeSlider
                      isDisabled
                      stepSize={0.5}
                      min={sliderNodeMarkers[index].range?.start}
                      max={sliderNodeMarkers[index].range?.end || 10}
                    />
                  </UI.Div>
                </UI.Grid>
              </UI.CardBody>
            </UI.Card>
          ))}
        </UI.Div>
      </UI.InputGrid>

    </UI.Div>
  );
};

export default SliderNodeForm;
