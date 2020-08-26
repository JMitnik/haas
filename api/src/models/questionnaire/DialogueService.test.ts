import { clearDatabase } from '../../test/utils/clearDatabase';
import { initSampleFullCustomer } from '../../test/data/SampleCustomer';
import DialogueService from './DialogueService';
import RoleService from './RoleService';
import prisma from '../../config/prisma';

describe('DialogueService tests', () => {
  // TODO: Ensure this never runs on production!
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(() => {
    prisma.disconnect();
  });

  it('Averages calculate score of dialogue with 0 interactions', async () => {
    const customer = await initSampleFullCustomer();

    expect(DialogueService.calculateAverageDialogueScore(customer.dialogues[0].id)).toEqual(0);
  });

  it('Averages calculate score of dialogue with some interactions', async () => {
    const customer = await initSampleFullCustomer();

    // TODO: Make some fake interactions and sessions (easy averages)
    expect(DialogueService.calculateAverageDialogueScore(customer.dialogues[0].id)).toEqual(0);
  });
});
