import DialogueService from './DialogueService';
import { mockNegativeEntries, mockPositiveEntries } from './__mocks__/mockEntries';

describe('DialogueService.getTopNPaths', () => {
  it('Deals appropriately with negativepaths', async () => {
    const paths = DialogueService.getTopNPaths(mockNegativeEntries, 3, 'negative');
    expect(paths.length).toBe(mockNegativeEntries.length);
  });

  it('Deals appropriately with positivepaths', async () => {
    const paths = DialogueService.getTopNPaths(mockPositiveEntries, 3, 'negative');
    expect(paths.length).toBe(mockPositiveEntries.length);
  });
});
