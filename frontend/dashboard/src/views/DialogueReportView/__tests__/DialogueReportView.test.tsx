himport '@testing-library/jest-dom/extend-expect';

import { MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import {
  createGetMock
} from './helpers';
import { getMockedWrapper } from '../../../../__tests__/Wrapper';
import Component, { ComponentProps } from '../Component';

const renderComponent = (props: ComponentProps, mocks: MockedResponse[] = []) => {
  const MockedWrapper = getMockedWrapper(mocks);

  return render(<Component {...props} />, { wrapper: MockedWrapper });
};

test('display maximum details', async () => {
  const GetMock = createGetMock(
    (variables) => variables,
    (response) => response,
  );

  renderComponent({

  }, [GetMock]);

  expect(await screen.findByText('X')).toBeInTheDocument();
});
