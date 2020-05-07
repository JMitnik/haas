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
