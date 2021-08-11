import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import styled, { css } from 'styled-components';

const PieChartModuleContainer = styled.div`
  height: 400px;
`;

interface PieChartData {
  id: string;
  value: number;
  average: number;
  color: string;
}

interface PieChartModuleProps {
  data: PieChartData[];
}

export const PieChartModule = ({ data }: PieChartModuleProps) => (
  <PieChartModuleContainer>
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      // @ts-ignore
      colors={(d) => d.data.color}
    />
  </PieChartModuleContainer>
);

