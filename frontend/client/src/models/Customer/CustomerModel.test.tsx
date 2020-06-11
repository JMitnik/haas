import CustomerModel from './CustomerModel';

test('creates a CustomerModel', () => {
  const customer = CustomerModel.create({
    id: '1',
    name: 'Starbucks',
    settings: {
      colourSettings: {
        primary: 'red',
      },
      logoUrl: 'https://www.vanatotzekerheid.nl/wp-content/uploads/2016/09/Starbucks-Logo-051711-600x566.gif',
    },
  });

  expect(customer.id).toBe('1');
});
