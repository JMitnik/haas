import * as UI from '@haas/ui';
import React from 'react';

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
  let text = '';
  let subText = '';

  if (isEarly) {
    text = 'That was quick!';
    subText = 'Tap me again if you are sure.';
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

    text = activeMarker?.label || 'Thanks for voting';
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

