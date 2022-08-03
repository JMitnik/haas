import { Route } from 'react-router-dom';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { debug } from 'jest-preview';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { NumberParam, QueryParamProvider, useQueryParams, withDefault } from 'use-query-params';
import { parse } from 'query-string';

const UseQueryParamExample = () => {
  const [filter, setFilter] = useQueryParams({ x: withDefault(NumberParam, 0) });
  console.log('Filter: ', filter);

  return (
    <div>
      <h1>{`x is ${filter.x}`}</h1>
      <button type="button" onClick={() => setFilter({ x: filter.x + 1 })}>Change</button>
    </div>
  );
};

// The test for the component
test('use query param example', async () => {
  const history = createMemoryHistory({ initialEntries: [{ search: '?x=3' }] });

  const { queryByText, findByText } = render(
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <UseQueryParamExample />
      </QueryParamProvider>
    </Router>,
  );

  const item = await findByText(/x is 3/);
  expect(item).toBeInTheDocument();

  fireEvent.click(await findByText('Change'));
  console.log(history.location.search);
  // expect(history.location.search).toEqual('?x=4');
  expect(parse(history.location.search)).toEqual({ x: '4' });
  debug();

  const itemAfterClicking = await findByText(/x is 4/);
  // console.log('Header: ', itemAfterClicking);
  expect(itemAfterClicking).toBeInTheDocument();
});
