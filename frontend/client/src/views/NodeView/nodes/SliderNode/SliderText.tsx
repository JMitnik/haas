import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { SliderNodeMarkersProps } from '../../../../models/Tree/SliderNodeMarkersModel';

interface SliderTextProps {
  color: string;
  adaptedColor: string;
  score: number;
  isEarly: boolean;
  markers: SliderNodeMarkersProps[];
}

/**
   * Renders adaptable SliderText based on current score, and relevant markers
   */
export const SliderText = ({ color, adaptedColor, score, isEarly, markers }: SliderTextProps) => {
  const { t } = useTranslation();
  let text = '';
  let subText = '';

  if (isEarly) {
    text = t('quick_release_text');
    subText = t('quick_release_subtext');
  }

  if (!isEarly && markers.length) {
    const activeMarker = markers.find((marker) => {
      const { start, end } = marker.range;

      const lowerBound = start || 0.0;
      const upperBound = end || 10.1;

      if (lowerBound <= score && upperBound > score) {
        return true;
      }

      return false;
    });

    text = activeMarker?.label || t('thanks_for_voting');
    subText = activeMarker?.subLabel || '';
  }

  return (
    <UI.Span ml={2} textAlign="left">
      <UI.Text fontSize="1rem" color={color}>
        {text}
      </UI.Text>
      <UI.Text fontSize="0.7rem" color={adaptedColor}>
        {subText}
      </UI.Text>
    </UI.Span>
  );
};

