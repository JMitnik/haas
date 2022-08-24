
import { act, fireEvent, render, screen, userEvent, waitFor, within } from 'test';
import { debug } from 'jest-preview';
import React from 'react';

import { includesText, mockQueryGetCTANodesOfDialogue } from './helpers';

import ActionOverview from '../ActionsOverview';

// @ts-ignore
// eslint-disable-next-line func-names
Document.prototype.createRange = function () {
  return {
    setEnd() { },
    setStart() { },
    getBoundingClientRect() {
      return { right: 0 };
    },
    getClientRects() {
      return {
        length: 0,
        left: 0,
        right: 0,
      };
    },
  };
};

jest.setTimeout(30000);

const renderComponent = () => {
  render(<ActionOverview />);
};

describe('ActionOverview', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  test('Can render ActionOverview component', async () => {
    mockQueryGetCTANodesOfDialogue((res) => ({ ...res }));
    renderComponent();
  });

  test('Filling in all fields should enable the save button', async () => {
    mockQueryGetCTANodesOfDialogue((res) => ({ ...res }));
    act(() => {
      renderComponent();
    });

    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add call')));
    await new Promise((r) => setTimeout(r, 2000));

    console.log(screen.getByTestId('editor'));
    const mdeShit = within(screen.getByTestId('editor')).getByRole('textbox');
    userEvent.type(mdeShit, 'hello');

    await new Promise((r) => setTimeout(r, 2000));

    debug();

    const select = screen.getByLabelText('ctaTypeTwo');

    fireEvent.click(select);
    userEvent.type(select, 'Form{enter}');

    await new Promise((r) => setTimeout(r, 2000));

    expect(screen.queryByText((text) => includesText(text, 'About the form'))).toBeInTheDocument();
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

    await new Promise((r) => setTimeout(r, 1000));

    const instructionHelperField = screen.getByLabelText((text) => includesText(text, 'helper'));
    const instructionHelperTestString = 'Instruction helper test';
    userEvent.type(instructionHelperField, instructionHelperTestString);
    expect(instructionHelperField).toHaveValue(instructionHelperTestString);

    await new Promise((r) => setTimeout(r, 1000));

    const instructionField = screen.getByLabelText((text) => text.includes('Instruction') && !text.includes('helper'));
    const instructionTestString = 'Instruction test';
    userEvent.type(instructionField, instructionTestString);
    expect(instructionField).toHaveValue(instructionTestString);

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Add field')));

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Edit field')));

    fireEvent.click(await screen.findByText(/Email address/));

    const labelField = screen.getByLabelText((text) => includesText(text, 'Label'));
    userEvent.type(labelField, 'Label test');
    expect(labelField).toHaveValue('Label test');

    fireEvent.click(await screen.findByText((text) => includesText(text, 'Finish')));

    fireEvent.click(window.document);

    await new Promise((r) => setTimeout(r, 1000));

    expect(screen.queryByText((text) => includesText(text, `Page 1: ${headerTestString}`))).toBeInTheDocument();
    expect(screen.queryByText((text) => includesText(text, '1 field'))).toBeInTheDocument();
    // debug();

    expect(screen.getByText('Save')).not.toBeDisabled();
  });

  test('Can create pre-form node', async () => {
    mockQueryGetCTANodesOfDialogue((res) => ({ ...res }));
    act(() => {
      renderComponent();
    });

    await new Promise((r) => setTimeout(r, 1000));
    fireEvent.click(screen.getByText((text) => includesText(text, 'add call')));

    await new Promise((r) => setTimeout(r, 2000));

    const select = screen.getByLabelText('ctaTypeTwo');

    fireEvent.click(select);
    userEvent.type(select, 'Form{enter}');

    await new Promise((r) => setTimeout(r, 2000));

    const addPreFormButton = screen.getByText((text) => includesText(text, 'Add pre'));

    fireEvent.click(addPreFormButton);

    waitFor(() => {
      screen.findByLabelText((text) => includesText(text, 'header'));
    });

    const headerField = screen.getByLabelText((text) => includesText(text, 'header'));
    userEvent.type(headerField, 'Pre-Form Header Test');
    expect(headerField).toHaveValue('Pre-Form Header Test');

    const helperField = screen.getByLabelText((text) => includesText(text, 'helper'));
    userEvent.type(helperField, 'Pre-form Helper');
    expect(helperField).toHaveValue('Pre-form Helper');

    const nextField = screen.getByLabelText((text) => includesText(text, 'next b'));
    userEvent.type(nextField, 'Next');
    expect(nextField).toHaveValue('Next');

    const finishField = screen.getByLabelText((text) => includesText(text, 'finish b'));
    userEvent.type(finishField, 'Finish');
    expect(finishField).toHaveValue('Finish');

    screen.debug(headerField.parentElement?.parentElement!.parentElement!);

    await new Promise((r) => setTimeout(r, 2000));

    // const savePreFormNodeButton = await within(
    //   headerField.parentElement?.parentElement!.parentElement!,
    // ).findByText('Save');

    const savePreFormNodeButton = await screen.findByText((text) => includesText(text, 'Save Pre'));
    screen.debug(savePreFormNodeButton);

    expect(savePreFormNodeButton).not.toBeDisabled();
    fireEvent.click(savePreFormNodeButton);

    await new Promise((r) => setTimeout(r, 2000));

    debug();

    expect(screen.getByText('Pre-Form Header Test')).toBeInTheDocument();

    const closeButton = await within(screen.getByLabelText('PreNodeFormCell')).findByRole('button');
    fireEvent.click(closeButton);

    await new Promise((r) => setTimeout(r, 2000));
    expect(screen.queryByText('Pre-Form Header Test')).not.toBeInTheDocument();
  });
});

