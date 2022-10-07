import { Prisma, PrismaClient } from '@prisma/client';
import { UserTourPrismaAdapter } from './UserTourPrismaAdapter';
import { CreateUserTourInput } from './UserTour.types';
import { buildCreateTourStepInput } from './UserTourPrismaAdapter.helpers';
import UserPrismaAdapter from '../../models/users/UserPrismaAdapter';
export class UserTourService {
  private userTourPrismaAdapter: UserTourPrismaAdapter;
  private userPrismaAdapter: UserPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.userTourPrismaAdapter = new UserTourPrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
  }

  /**
   * Creates a TourOfUser entry for every user in the database, thus 'dispatching' the tour to the current users
   */
  public async dispatchTourToUsers(userTourId: string, userIds: string[]) {
    const createManyInput: Prisma.TourOfUserCreateManyInput[] = userIds.map((userId) => ({
      userId,
      userTourId,
    }));

    return this.userTourPrismaAdapter.createManyTourOfUser(createManyInput);
  }

  /**
   * Create a user tour and dispatches it to all current users in database
   */
  public async createAndDispatchUserTour(input: CreateUserTourInput) {
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

    const userIds: string[] = (await this.userPrismaAdapter.findAll()).map((user) => user.id);
    await this.dispatchTourToUsers(userTour.id, userIds);
    return userTour;
  }

  /**
   * Find user tour by id
   */
  public async findUserTour(userTourId: string) {
    return this.userTourPrismaAdapter.findUserTour(userTourId);
  }

  public async findUserToursByUserId(userId: string) {
    const user = await this.userPrismaAdapter.getUserById(userId);

    // TODO: Further priortize which tours should be seen 
    // e.g. only get the one release with latest version
    const tourOfUserWhereInput: Prisma.TourOfUserWhereInput = {
      userId,
      seenAt: null,
    };

  }

  /**
   * Find tour steps by user tour id
   */
  public async findTourStepsByUserTour(userTourId: string) {
    const whereInput: Prisma.TourStepWhereInput = { userTourId };
    return this.userTourPrismaAdapter.findManyTourSteps(whereInput);
  }

}
