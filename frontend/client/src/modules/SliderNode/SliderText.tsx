import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { Marker } from 'types/core-types';

interface SliderTextProps {
  color: string;
  adaptedColor: string;
  score: number;
  isEarly: boolean;
  markers: Marker[];
  isNotStarted: boolean;
}

/**
   * Renders adaptable SliderText based on current score, and relevant markers
   */
export const SliderText = ({ color, adaptedColor, score, isEarly, markers, isNotStarted }: SliderTextProps) => {
  const { t } = useTranslation();
  let text = '';
  let subText = '';

  if (isEarly) {
    text = t('quick_release_text');
    subText = t('quick_release_subtext');
  }

  if (isNotStarted) {
    text = t('slide_explainer');
    subText = t('slide_explainer_helper');
    color = 'main.700';
    adaptedColor = 'off.600';
  }

  if (!isNotStarted && !isEarly && markers.length) {
    const activeMarker = markers.find((marker) => {
      const lowerBound = marker?.range?.start || 0.0;
      const upperBound = marker?.range?.end || 10.1;

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

