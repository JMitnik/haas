import SliderNode from './SliderNode';
import { DialogueTreeProvider } from 'providers/dialogue-tree-provider';
import React from 'react';
import { mockEmptyDialogue } from 'tests/mocks/mockDialogues';
import { mockCustomerWithoutDialogue } from 'tests/mocks/mockCustomers';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components/macro';
import theme from 'config/theme';

test('<SliderNode/> renders', () => {
    const emptyDialogue = mockEmptyDialogue();
    const emptyCustomer = mockCustomerWithoutDialogue();

    const {rerender} = render(
        <>
            <ThemeProvider theme={theme}>
                <DialogueTreeProvider customer={emptyCustomer} dialogue={emptyDialogue}>
                    <SliderNode node={emptyDialogue.rootQuestion} />
                </DialogueTreeProvider>
            </ThemeProvider>
        </>
    );
});
