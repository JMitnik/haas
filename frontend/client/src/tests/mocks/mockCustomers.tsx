import { Customer, Dialogue } from 'types/generic';

const defaultCustomerName = 'Customer X';

export const mockCustomerWithoutDialogue = (): Customer => {
    return {
        name: defaultCustomerName,
        settings: {
            logoUrl: ''
        }
    };
}

export const mockCustomerWithDialogue = (dialogue?: Dialogue): Customer => {
    return {
        name: 'Customer X',
        settings: {
            logoUrl: ''
        }
    };
}

export const mockFullCustomer = {
    id: '123123',
    name: 'Customer X',
    slug: 'customer-x',
    settings: {
        id: '13123',
        logoUrl: 'https://www.google.com',
        colourSettings: {
            id: '12312',
            primary: '#ddd',
            primaryAlt: '#fff',
            secondary: 'red',
        }
    },
    dialogues: [{
        id: 1,
        description: "Working field",
        title: "Great to have you!",
        publicTitle: "Great-life"
    }]
};
