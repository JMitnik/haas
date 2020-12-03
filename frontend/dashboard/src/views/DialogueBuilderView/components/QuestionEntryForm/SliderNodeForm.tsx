import * as UI from '@haas/ui';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import React from 'react';

const SliderNodeForm = ({ form }: { form: any }) => {
  const { t } = useTranslation();

  const markers = useFieldArray({
    name: 'sliderNode.markers',
    control: form.control,
    keyName: 'fieldIndex',
  });

  const sliderNodeMarkers = form.watch('sliderNode.markers');

  return (
    <UI.Div>
      <UI.Text color="gray.600" mb={1}>{t('dialogue:markers')}</UI.Text>
      <UI.Div maxWidth={500}>
        <UI.Text fontSize="0.8rem" mb={4} color="gray.500">
          {t('dialogue:markers_helper')}
        </UI.Text>
      </UI.Div>
      {markers.fields.map((marker, index) => (
        <UI.Card boxShadow="lg" key={marker.fieldIndex} mb={4} noHover>
          <UI.CardBody>
            <UI.Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr', '1fr 2fr']}>
              <UI.Div>
                <UI.Div mb={2}>
                  <UI.FormControl>
                    <UI.FormLabel htmlFor={`sliderNode.markers[${index}].label`}>{t('label')}</UI.FormLabel>
                    <UI.Input size="sm" name={`sliderNode.markers[${index}].label`} defaultValue={marker.label} />
                  </UI.FormControl>
                </UI.Div>
                <UI.FormControl>
                  <UI.FormLabel htmlFor={`sliderNode.markers[${index}].subLabel`}>{t('sub_label')}</UI.FormLabel>
                  <UI.Input size="sm" name={`sliderNode.markers[${index}].subLabel`} defaultValue={marker.subLabel} />
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
  );
};

export default SliderNodeForm;
