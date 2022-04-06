/* eslint-disable max-len */
import { Polygon } from '@visx/shape';
import { useTranslation } from 'react-i18next';
import React from 'react';

/* -------------------------------------------------------------------------
 * SingleHexagon
 * -------------------------------------------------------------------------*/

interface SingleHexagonProps {
  fill: string;
}

const SingleHexagon = ({ fill }: SingleHexagonProps) => {
  const { t } = useTranslation();

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      fill={fill}
      xmlSpace="preserve"
      width={10}
    >
      <g>
        <g>
          <path d="M485.291,129.408l-224-128c-3.285-1.877-7.296-1.877-10.581,0l-224,128c-3.328,1.899-5.376,5.44-5.376,9.259v234.667 c0,3.819,2.048,7.36,5.376,9.259l224,128c1.643,0.939,3.456,1.408,5.291,1.408c1.835,0,3.648-0.469,5.291-1.408l224-128 c3.328-1.899,5.376-5.44,5.376-9.259V138.667C490.667,134.848,488.619,131.307,485.291,129.408z M469.333,367.147L256,489.045 L42.667,367.147V144.853L256,22.955l213.333,121.899V367.147z" />
        </g>
      </g>
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
      <g />
    </svg>

  );
};

export { SingleHexagon };
