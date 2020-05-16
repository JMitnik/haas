import { MockedResponse } from "@apollo/react-testing";
import getCustomerFromSlug from "queries/getCustomerFromSluqQuery";
import { mockFullCustomer } from "./mockCustomers";
import { mockFullDialogue } from "./mockDialogues";
import getDialogueQuery from "queries/getDialogueQuery";

const apolloMocks: MockedResponse[] = [
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

export default apolloMocks;
