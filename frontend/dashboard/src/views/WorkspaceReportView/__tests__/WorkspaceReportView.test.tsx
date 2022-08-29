import '@testing-library/jest-dom/extend-expect';
import { parse } from 'date-fns';

import React from 'react';

import { DateFormat } from 'hooks/useDate';
import { render, screen } from 'test';

import { WorkspaceReportView } from '../WorkspaceReportView';
import {
  mockGetIssuesQuery, mockGetWorkspaceReportQuery,
} from './helpers';

/**
 * Fetch a widget card
 */
const getWidget = (headerText: string) => screen.getByText(headerText).parentElement?.parentElement?.parentElement;

test('display bar chart', async () => {
  mockGetIssuesQuery((res) => res);
  mockGetWorkspaceReportQuery((res) => res);

  render(
    <WorkspaceReportView
      startDate={parse('12-08-2022', DateFormat.DayFormat, new Date())}
      endDate={parse('21-08-2022', DateFormat.DayFormat, new Date())}
    />,
  );

  expect(await screen.findByText('Weekly report')).toBeInTheDocument();

  // Check that the total summaries are 0
  expect((await screen.findByText('Total responses')).parentElement).toContainHTML('24');
  expect(screen.getByText('Total problems').parentElement).toContainHTML('0');

  // Check that only *one* bar chart for responses has a certain height
  const responseWidget = getWidget('Total responses');
  const bars = responseWidget?.querySelectorAll('rect') || [];
  const barHeightLabels = [...bars].map((bar) => bar.getAttribute('aria-label'));
  const barHeights = barHeightLabels.map((label) => {
    const regexMatch = label?.match('bar-height-(.*)');

    if (regexMatch && regexMatch.length > 1) {
      return Number(regexMatch[1]);
    }

    return 0;
  });

  expect(barHeights.filter((height) => height > 100)).toHaveLength(1);
});
