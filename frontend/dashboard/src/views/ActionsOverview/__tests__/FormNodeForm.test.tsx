
import { FormProvider, useForm } from 'react-hook-form';
import { debug } from 'jest-preview';
import { fireEvent, queryByText, render, screen, userEvent } from 'test';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';

import { FormDataProps } from '../CTATypes';
import { includesText } from './helpers';
import { schema } from '../CTAForm';

import FormNodeForm from '../FormNodeForm';

const FormProviderComponent = () => {
  const formMethods = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  return (
    <FormProvider {...formMethods}>
      <FormNodeForm />
    </FormProvider>
  );
};

const renderComponent = () => {
  render(<FormProviderComponent />);
};

describe('FormNodeForm', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  test('Can render FormNodeForm component', async () => {
    renderComponent();
  });

  test('Can create Form Node Step', async () => {
    renderComponent();
    await new Promise((r) => setTimeout(r, 2000));
    fireEvent.click(screen.getByText((text) => text.toLowerCase().includes('add step')));
    await new Promise((r) => setTimeout(r, 2000));
    debug();
    expect(screen.queryByText((text) => text.toLowerCase().includes('page 1')));
  });

  test('Can create Form Node Field on Step', async () => {
    renderComponent();
    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add step')));
    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.queryByText((text) => includesText(text, 'page 1'))).toBeInTheDocument();
    expect(screen.queryByText((text) => includesText(text, '0 field'))).toBeInTheDocument();
    fireEvent.click(await screen.findByText((text) => includesText(text, 'Edit step')));
    await new Promise((r) => setTimeout(r, 1000));

    const headerField = screen.getByLabelText((text) => includesText(text, 'Header'));
    const headerTestString = 'Header test';
    userEvent.type(headerField, headerTestString);
    expect(headerField).toHaveValue(headerTestString);

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Add field')));
    await new Promise((r) => setTimeout(r, 1000));

    fireEvent.click(window.document);
    expect(screen.queryByText((text) => includesText(text, `Page 1: ${headerTestString}`))).toBeInTheDocument();
    expect(screen.queryByText((text) => includesText(text, '1 field'))).toBeInTheDocument();
    debug();
  });

  test('Can change position of Form Node Steps', async () => {
    renderComponent();
    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add step')));
    await new Promise((r) => setTimeout(r, 1000));

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Edit step')));
    await new Promise((r) => setTimeout(r, 1000));

    const headerField = screen.getByLabelText((text) => includesText(text, 'Header'));
    const headerTestString = 'Header test';
    userEvent.type(headerField, headerTestString);

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Add field')));
    userEvent.click(document.body);
    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add step')));

    const editSteps = await screen.findAllByText((text) => includesText(text, 'Edit step'));
    expect(editSteps).toHaveLength(2);

    const moveUpButtons = await screen.findAllByLabelText((text) => includesText(text, 'step up'));
    expect(moveUpButtons).toHaveLength(2);
    expect(moveUpButtons[0]).toBeDisabled();
    expect(moveUpButtons[1]).not.toBeDisabled();

    const moveDownButtons = await screen.findAllByLabelText((text) => includesText(text, 'step down'));
    expect(moveDownButtons[1]).toBeDisabled();
    expect(moveDownButtons[0]).not.toBeDisabled();

    // Move first row down
    fireEvent.click(moveDownButtons[0]);
    expect(screen.queryByText((text) => includesText(text, `Page 2: ${headerTestString}`))).toBeInTheDocument();

    // Move second row up
    fireEvent.click(moveUpButtons[0]);
    expect(screen.queryByText((text) => includesText(text, `Page 1: ${headerTestString}`))).toBeInTheDocument();
    debug();
  });

  test('Can delete a Form Node Step', async () => {
    renderComponent();
    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add step')));

    const deleteButton = screen.getByLabelText((text) => includesText(text, 'Delete step'));
    fireEvent.click(deleteButton);

    expect(screen.queryByText((text) => includesText(text, 'Page 1'))).not.toBeInTheDocument();
    expect(screen.queryByText((text) => includesText(text, 'first step'))).toBeInTheDocument();

    debug();
  });
});

