import UserService from './UserService';
import { MockContext, Context, createMockContext } from '../../context';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = (mockCtx as unknown) as Context;
});

test('should create new user ', async () => {
  const user = {
    id: 'PLACEHOLDER',
    firstName: 'Rich',
    lastName: 'Prisma',
    email: 'hello@prisma.io',
    phone: '+316906538',
    roleId: undefined,
    createdAt: new Date(),
    updatedAt: null,
    password: '',
    globalPermissions: [],
    loginToken: null,
    loginTokenExpiry: null,
    refreshToken: '',
    refreshTokenExpiry: null,
    lastActivity: null,
  };

  mockCtx.prisma.user.create.mockResolvedValue(user);
  const userService = new UserService(ctx.prisma);
  // TODO: Fix underlying test
  // await expect(userService.createUser(user)).resolves.toMatchObject({
  //   firstName: 'Rich',
  //   lastName: 'Prisma',
  //   email: 'hello@prisma.io',
  //   phone: '+316906538',
  // });
});
