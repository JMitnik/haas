import * as UI from '@haas/ui';
import { Axis, Orientation } from '@visx/axis';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { defaultStyles, useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { scaleBand, scaleLinear } from '@visx/scale';
import React, { useMemo } from 'react';

import { DateFormat, useDate } from 'hooks/useDate';
import mainTheme from 'config/theme';

import { EventBarsContainer } from './EventBars.styles';
import { calculateDateRange, Event, padEvents } from './EventBars.helpers';

interface EventBarsProps {
  width: number;
  height: number;
  events: Event[];
}

export const EventBars = ({ events, width, height }: EventBarsProps) => {
  const { format, getNWeekAgo, getNow } = useDate();

  const formatDate = (date: Date) => format(date, DateFormat.DayFormat);
  const dateRange = useMemo(() => calculateDateRange(getNWeekAgo(2), getNow()), [getNWeekAgo, getNow]);

  const dateScale = useMemo(() => scaleBand<string>({
    domain: dateRange,
    padding: 0.2,
    range: [0, width],
  }), [dateRange, width]);

  console.log(dateRange);

  const yMax = height - 2;

  const maxFreq = useMemo(() => Math.max(...events.map((event) => event.frequency)), [events]);

  const freqScale = useMemo(() => scaleLinear<number>({
    domain: [0, maxFreq],
    range: [0, height],
  }), [maxFreq, height]);

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Event>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const paddedEvents = padEvents(events, getNWeekAgo(2), getNow());
  console.log(paddedEvents);

  return (
    <EventBarsContainer>
      <svg ref={containerRef} width={width} height={height}>
        <Group>
          {paddedEvents.map((event) => {
            console.log(formatDate(event.date));
            const barWidth = dateScale.bandwidth();
            const barHeight = (freqScale(event.frequency) ?? 0);
            const barX = dateScale(formatDate(event.date));
            console.log(barX);

            const barY = yMax - barHeight;

            return (
              <Bar
                key={`${event.date}-${event.id}`}
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
                  {Math.floor(tooltipData.frequency)}
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
