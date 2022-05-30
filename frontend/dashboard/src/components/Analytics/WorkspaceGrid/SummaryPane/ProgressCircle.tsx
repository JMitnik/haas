import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import React from 'react';

import { fadeMotion } from 'components/animation/config';

interface ProgressCircleProps {
  percentage: number;
  strokeWidth: number;
  size: number;
  radius: number;
  backgroundStroke: string;
  stroke: string;
  children?: React.ReactNode;
}

export const ProgressCircle = ({
  size,
  stroke,
  backgroundStroke,
  strokeWidth,
  children,
  percentage = 80,
  radius = 45,
}: ProgressCircleProps) => {
  const circumference = Math.ceil(2 * Math.PI * radius);
  const fillPercentage = Math.abs(Math.ceil((circumference / 100) * (percentage - 100)));

  const { transition } = fadeMotion;

  console.log({ percentage, stroke, fillPercentage });

  const variants = {
    hidden: {
      strokeDashoffset: circumference,
      transition,
    },
    show: {
      strokeDashoffset: fillPercentage,
      transition,
    },
  };

  return (
    <UI.Div height={size} width={size} position="relative">
      <svg
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="circle"
          strokeWidth={strokeWidth}
          stroke={backgroundStroke}
          strokeOpacity={0.25}
          fill="transparent"
        />
      </svg>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: 'rotate(-90deg)',
          overflow: 'visible',
          top: 0,
        }}
      >
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={stroke}
          fill="transparent"
          strokeDashoffset={fillPercentage}
          strokeDasharray={circumference}
          variants={variants}
          initial="hidden"
          animate="show"
        />
      </svg>

      {!!children && (
        <UI.Div position="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {children}
        </UI.Div>
      )}
    </UI.Div>
  );
};
