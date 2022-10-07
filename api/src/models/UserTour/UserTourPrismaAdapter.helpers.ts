import { Prisma } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { CreateUserTourInput } from './UserTour.types';

export const buildCreateTourStepInput = (
  input: CreateUserTourInput['steps']
): Prisma.TourStepCreateWithoutUserTourInput[] => {
  return input.filter(isPresent).map((step) => (
    {
      helperKey: step?.helperKey,
      titleKey: step?.titleKey,
      imageUrlKey: step?.imageUrlKey,
    }
  ))
}