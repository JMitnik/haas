import { Prisma } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { CreateUserTourInput } from './UserTour.types';

export const buildUpsertTourStepInput = (
  input: CreateUserTourInput['steps']
): Prisma.TourStepUpsertWithWhereUniqueWithoutUserTourInput[] => {
  return input.filter(isPresent).map((step) => ({
    where: {
      id: step?.id || '-1',
    },
    create: {
      helperKey: step.helperKey,
      titleKey: step.titleKey,
      imageUrlKey: step.imageUrlKey,
    },
    update: {
      helperKey: step.helperKey,
      titleKey: step.titleKey,
      imageUrlKey: step.imageUrlKey,
    },
  }))
}

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