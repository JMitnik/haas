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

import { Event, calculateDateRange, padEvents } from './EventBars.helpers';
import { EventBarsContainer } from './EventBars.styles';

interface EventBarsProps {
  width: number;
  height: number;
  events: Event[];
  startDate: Date;
  endDate: Date;
  tickFormat?: DateFormat;
  showFrequency?: boolean;
  fill?: string;
}

export const EventBars = ({
  events,
  startDate,
  endDate,
  width,
  height,
  tickFormat,
  showFrequency,
  fill = mainTheme.colors.off[100],
}: EventBarsProps) => {
  const { format, getNWeekAgo, getNow, parse } = useDate();

  const formatDate = (date: Date) => format(date, DateFormat.DayFormat);
  const dateRange = useMemo(() => calculateDateRange(startDate, endDate), [getNWeekAgo, getNow]);

  const showTicks = !!tickFormat;

  const dateScale = useMemo(() => scaleBand<string>({
    domain: dateRange,
    padding: 0.2,
    range: [0, width],
  }), [dateRange, width]);

  const bottomPadding = showTicks ? 50 : 0;
  const topPadding = showFrequency ? 30 : 0;

  // Max y coordinates
  const yMax = height + topPadding;

  const maxFreq = useMemo(() => Math.max(...events.map((event) => event.frequency)), [events]);

  const freqScale = useMemo(() => scaleLinear<number>({
    domain: [0, maxFreq],
    range: [0, height - bottomPadding],
  }), [maxFreq, height]);

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } = useTooltip<Event>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  const paddedEvents = padEvents(events, startDate, endDate);

  return (
    <EventBarsContainer>
      <svg ref={containerRef} width={width} height={height}>
        <Group>
          {paddedEvents.map((event) => {
            const barWidth = dateScale.bandwidth();
            const barHeight = (freqScale(event.frequency) ?? 0);
            const barX = dateScale(formatDate(event.date));

            const barY = yMax - barHeight;

            return (
              <Group
                key={`${event.date}-${event.id}`}
                x={barX}
                y={barY}
              >
                {showFrequency && (
                  <text className="event-label" x={(barX || 0) + 5} y={barY - 55}>
                    <tspan>
                      {Math.floor(event.frequency)}
                    </tspan>
                  </text>
                )}
                <Bar
                  className="event-bar"
                  x={barX}
                  y={barY - bottomPadding}
                  width={barWidth}
                  height={barHeight}
                  fill={fill}
                  onMouseOver={(e) => showTooltip({
                    tooltipData: event,
                    tooltipTop: localPoint(e)?.y || 0,
                    tooltipLeft: (barX ?? 0) + barWidth / 2,
                  })}
                  onMouseOut={hideTooltip}
                />
              </Group>
            );
          })}

          <Axis
            orientation={Orientation.bottom}
            top={yMax - 50}
            scale={dateScale}
            stroke="transparent"
            tickStroke={mainTheme.colors.off[200]}
            tickClassName="tick"
            numTicks={paddedEvents.length}
            tickFormat={(tickDate: string) => {
              if (!showTicks) return undefined;
              return format(parse(tickDate, DateFormat.DayFormat), DateFormat.HumanDay);
            }}
          />
        </Group>

        {tickFormat && (
          <Group>
            test
          </Group>
        )}
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
