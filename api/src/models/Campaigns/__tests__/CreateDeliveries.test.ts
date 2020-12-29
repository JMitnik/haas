import { validateDeliveryRows } from '../CreateBatchDeliveriesResolver';

describe('Delivery creation validation', () => {
  test('it validates a random entry correctly', () => {
    const { erroredRecords } = validateDeliveryRows([{ test }], ['EMAIL']);
    expect(erroredRecords).toHaveLength(1);
  });
});
