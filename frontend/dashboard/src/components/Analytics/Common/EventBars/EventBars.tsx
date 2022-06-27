import * as UI from '@haas/ui';
import { Axis, Orientation } from '@visx/axis';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { eachDayOfInterval, format } from 'date-fns';
import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear } from '@visx/scale';
import React, { useMemo } from 'react';

import { DateFormat } from 'hooks/useDate';
import mainTheme from 'config/theme';
import styled, { css } from 'styled-components';

export interface Event {
  freq: number;
  date: Date;
}

interface EventBarsProps {
  width: number;
  height: number;
  events: Event[];
}

const formatDate = (date: Date) => format(date, DateFormat.DayFormat);

const calculateDateRange = (events: Event[]) => {
  const startDate = events[0].date;
  const endDate = events[events.length - 1].date;

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map((date) => format(date, DateFormat.DayFormat));
};

const EventBarsContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
    transition: all ${theme.transitions.normal};

    .tooltip {
      background: transparent !important;
      padding: 0 !important;
    }

    .event-bar:hover {
      cursor: pointer;
      transition: all ${theme.transitions.normal};
      fill: ${theme.colors.off[300]};
    }
  `}
`;
export const EventBars = ({ events, width, height }: EventBarsProps) => {
  const dateScale = useMemo(() => scaleBand<string>({
    domain: calculateDateRange(events),
    padding: 0.2,
    range: [0, width],
  }), [events, width]);

  const yMax = height - 2;

  const maxFreq = useMemo(() => Math.max(...events.map((event) => event.freq)), [events]);

  const freqScale = useMemo(() => scaleLinear<number>({
    domain: [0, maxFreq],
    range: [0, height],
  }), [maxFreq, height]);

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Event>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  return (
    <EventBarsContainer>
      <svg ref={containerRef} width={width} height={height}>
        <Group>
          {events.map((event) => {
            const barWidth = dateScale.bandwidth();
            const barHeight = (freqScale(event.freq) ?? 0);
            const barX = dateScale(formatDate(event.date));
            const barY = yMax - barHeight;

            return (
              <Bar
                key={event.date.toISOString()}
                className="event-bar"
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={mainTheme.colors.off[100]}
                onMouseOver={(e) => showTooltip({
                  tooltipData: event,
                  tooltipTop: localPoint(e)?.y || 0,
                  tooltipLeft: (barX ?? 0) + barWidth / 2,
                })}
                onMouseOut={hideTooltip}
              />
            );
          })}

          <Axis
            orientation={Orientation.bottom}
            top={yMax}
            scale={dateScale}
            stroke="transparent"
            tickStroke={mainTheme.colors.off[200]}
            tickValues={undefined}
            numTicks={events.length}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultStyles, background: 'transparent', boxShadow: 'none' }}
        >
          <UI.Card style={{ minWidth: 180 }}>
            <UI.CardBody>
              <UI.Flex justifyContent="space-between">
                <UI.Span color={mainTheme.colors.off[500]} style={{ fontWeight: 700 }}>
                  Responses
                </UI.Span>
                <UI.Span color="off.600">
                  {tooltipData.freq}
                </UI.Span>
              </UI.Flex>
              <UI.Flex mt={2} justifyContent="space-between">
                <UI.Span color={mainTheme.colors.off[500]} style={{ fontWeight: 700 }}>
                  Date
                </UI.Span>
                <UI.Span color="off.600">
                  {formatDate(tooltipData.date)}
                </UI.Span>
              </UI.Flex>
            </UI.CardBody>
          </UI.Card>
        </TooltipInPortal>
      )}
    </EventBarsContainer>
  );
};
