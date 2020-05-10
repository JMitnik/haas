import { renderHook, act } from '@testing-library/react-hooks';
import wait from 'waait';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { render } from "@testing-library/react";
import gql from 'graphql-tag';
import React from "react";
import useProject, { ProjectProvider } from "./ProjectProvider";
import { mockCustomerWithoutDialogue, mockFullCustomer, } from "tests/mocks/mockCustomers";
import { mockEmptyDialogue, mockFullDialogue } from 'tests/mocks/mockDialogues';
import { MemoryRouter } from 'react-router-dom';
import { CustomerFragment } from 'queries/CustomerFragment';
import { QuestionFragment } from 'queries/QuestionFragment';


const getDialogueQuery = gql`
  query getDialogue($id: ID!) {
    dialogue(where: { id: $id }) {
      id
      title
      publicTitle
      creationDate
      updatedAt
      leafs {
        id
        title
        type
      }
      customerId
      questions {
        ...QuestionFragment
      }
      customer {
        ...CustomerFragment
      }
    }
  }
  ${CustomerFragment}
  ${QuestionFragment}
`;

const getCustomerFromSlug = gql`
    query customer($slug: String!) {
        customer(slug: $slug) {
            ...CustomerFragment
        }
    }
    ${CustomerFragment}
`;

const mocks: MockedResponse[] = [
    {
        request: {
            query: getCustomerFromSlug,
            variables: {
                slug: 'companyX'
            }
        },
        result: {
            data: {
                customer: mockFullCustomer
            }
        }
    },
    {
        request: {
            query: getDialogueQuery,
            variables: {
                id: '123',
            }
        },
        result :{
            data: {
                dialogue: mockFullDialogue
            }
        }
    }
];

const MockContainer = ({ baseUrl, children }: { baseUrl?: string, children?: React.ReactNode }) => {
    return (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
            defaultOptions={{
                watchQuery: { fetchPolicy: 'no-cache' },
                query: { fetchPolicy: 'no-cache' },
            }}
        >
            <MemoryRouter initialEntries={[baseUrl || '']}>
                <ProjectProvider>
                    {children}
                </ProjectProvider>
            </MemoryRouter>
        </MockedProvider>
    )
}

test('<ProjectProvider /> renders', () => {
    render(<MockContainer/>);
    wait(0);
});

test('<ProjectProvider /> returns only customer', () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => <MockContainer baseUrl="/">{children}</MockContainer>;


    const { result } = renderHook(() => useProject(), { wrapper });
    wait(0);
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
