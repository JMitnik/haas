import { renderHook, act } from '@testing-library/react-hooks';
import wait from 'waait';
import { render } from "@testing-library/react";
import React from "react";
import useProject from "./ProjectProvider";
import { mockCustomerWithoutDialogue, } from "tests/mocks/mockCustomers";
import { mockEmptyDialogue } from 'tests/mocks/mockDialogues';
import MockContainer from 'tests/mocks/MockContainer';

test('<ProjectProvider /> renders', () => {
    render(<MockContainer/>);
    wait(0);
});

test('<ProjectProvider /> returns only customer', () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer>{children}</MockContainer>;
    const { result } = renderHook(() => useProject(), { wrapper });
    expect(result.current.customer).toBeNull();

    // Now add a customer
    act(() => {
        result.current.setCustomer(mockCustomerWithoutDialogue);
    });

    expect(result.current.customer).toBe(mockCustomerWithoutDialogue);
});

test('<ProjectProvider /> returns both customer and dialogue on set', () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer>{children}</MockContainer>;
    const { result } = renderHook(() => useProject(), { wrapper });

    wait(0);
    expect(result.current.dialogue).toBeNull();

    // Now add a customer
    act(() => {
        result.current.setCustomerAndDialogue(mockCustomerWithoutDialogue, mockEmptyDialogue);
    });

    expect(result.current.customer).toBe(mockCustomerWithoutDialogue);
    expect(result.current.dialogue).toBe(mockEmptyDialogue);
});

test('<ProjectProvider /> returns the customer at the URL', async () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer baseUrl="/companyX">{children}</MockContainer>;

    const { result } = renderHook(() => useProject(), { wrapper });

    await act(async () => {
        await wait(0);
    })

    expect(result.current.customer.id).toBeTruthy();
});

test('<ProjectProvider /> returns the customer AND dialogue at the URL', async () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer baseUrl="/companyX/123">{children}</MockContainer>;

    const { result } = renderHook(() => useProject(), { wrapper });

    await act(async () => {
        await wait(0);
    })

    expect(result.current.dialogue?.rootQuestion?.id).toBeTruthy();
    expect(result.current.customer?.id).toBeTruthy();
});
