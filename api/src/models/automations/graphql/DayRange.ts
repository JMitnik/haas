import { objectType } from '@nexus/schema';

export const DayRange = objectType({
  name: 'DayRange',
  definition(t) {
    t.string('label');
    t.int('index');
  }
})