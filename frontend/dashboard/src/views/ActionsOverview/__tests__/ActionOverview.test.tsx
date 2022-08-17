
import { act, fireEvent, render, screen, userEvent, within } from 'test';
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
    // pasteWysiwyg('CTA title', document.querySelectorAll('textarea')[1]);

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
});

