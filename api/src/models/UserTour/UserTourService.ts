import { Prisma, PrismaClient } from '@prisma/client';

import { UserTourPrismaAdapter } from './UserTourPrismaAdapter';
import { CreateUserTourInput } from './UserTour.types';
import { buildCreateTourStepInput, buildUpsertTourStepInput } from './UserTourPrismaAdapter.helpers';
import UserPrismaAdapter from '../../models/users/UserPrismaAdapter';
import { UserTours } from './UserTour.helper';
import { isPresent } from 'ts-is-present';
export class UserTourService {
  private userTourPrismaAdapter: UserTourPrismaAdapter;
  private userPrismaAdapter: UserPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.userTourPrismaAdapter = new UserTourPrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
  }

  /** Updates a user tour */
  public async updateUserTour(userTourId: string, input: CreateUserTourInput) {
    const stepIds = input.steps.map((step) => step?.id).filter(isPresent);
    const updateData: Prisma.UserTourUpdateInput = {
      type: input.type,
      triggerPage: input.triggerPage,
      triggerVersion: input.triggerVersion,
      steps: {
        deleteMany: {
          id: {
            notIn: stepIds,
          },
        },
        upsert: buildUpsertTourStepInput(input.steps),
      },
    };
    return this.userTourPrismaAdapter.updateUserTour(userTourId, updateData);
  }

  /**
   * Finishes a tour for a specific user
   */
  public async finishTourOfUser(userTourId: string, userId: string) {
    const updateInput: Prisma.TourOfUserUpdateInput = { seenAt: new Date() }
    return this.userTourPrismaAdapter.updateTourOfUser(userTourId, userId, updateInput);
  }

  /**
   * Creates a TourOfUser entry for every user in the database, thus 'dispatching' the tour to the current users
   * Note: if a tour already exists for a user it will be skipped.
   */
  public async dispatchTourToUsers(userTourId: string, userIds: string[]) {
    const createManyInput: Prisma.TourOfUserCreateManyInput[] = userIds.map((userId) => ({
      userId,
      userTourId,
    }));

    return this.userTourPrismaAdapter.createManyTourOfUser(createManyInput);
  }

  /** Creates a user tour */
  public async createUserTour(input: CreateUserTourInput) {
    const createData: Prisma.UserTourCreateInput = {
      id: input.id || undefined,
      type: input.type,
      triggerPage: input.triggerPage,
      triggerVersion: input.triggerVersion,
      steps: {
        create: buildCreateTourStepInput(input.steps),
      },
    };

    const userTour = await this.userTourPrismaAdapter.createUserTour(createData);
    return userTour;
  }

  /**
   * Dispatches a user tour to all users within the database
   */
  public async dispatchUserTour(userTourId: string, userIds?: string[]) {
    try {
      const dispatchUserIds: string[] = !userIds?.length
        ? (await this.userPrismaAdapter.findAll()).map((user) => user.id)
        : userIds;
      await this.dispatchTourToUsers(userTourId, dispatchUserIds);
      return true
    } catch {
      return false;
    }
  }

  /**
   * Create a user tour and dispatches it to all current users in database
   */
  public async createAndDispatchUserTour(input: CreateUserTourInput) {
    const userTour = await this.createUserTour(input);
    await this.dispatchUserTour(userTour.id);
    return userTour;
  }

  /**
   * Find user tour by id
   */
  public async findUserTour(userTourId: string) {
    return this.userTourPrismaAdapter.findUserTour(userTourId);
  }

  /**
   * Finds all user tours of a specific user 
   * @returns UserTour helper wrapper
   */
  public async findUserTours(userId: string) {
    const userTourWhereInput: Prisma.UserTourWhereInput = {
      usersOfTour: {
        some: {
          userId,
        },
      },
    }

    const userTours = await this.userTourPrismaAdapter.findManyUserTours(userTourWhereInput, userId);
    const userToursWrapper = new UserTours(userTours);
    return userToursWrapper;
  }

  /**
   * Find tour steps by user tour id
   */
  public async findTourStepsByUserTour(userTourId: string) {
    const whereInput: Prisma.TourStepWhereInput = { userTourId };
    return this.userTourPrismaAdapter.findManyTourSteps(whereInput);
  }

}
