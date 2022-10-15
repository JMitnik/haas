import { enumType } from 'nexus';

export const TourType = enumType({
  name: 'TourType',
  members: ['RELEASE', 'GUIDE'],
});