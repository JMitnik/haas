import { inputObjectType, mutationField, objectType, queryField } from 'nexus';
import { ApolloError } from 'apollo-server-express';
import { GraphQLYogaError } from '@graphql-yoga/node';

import { UserType } from '../users/graphql/User';
import { mailService } from '../../services/mailings/MailService';
import AuthService from './AuthService';
import makeSignInTemplate from '../../services/mailings/templates/makeSignInTemplate';
import verifyAndDecodeToken from './verifyAndDecodeToken';
import { APIContext } from '../../types/APIContext';

export const RegisterInput = inputObjectType({
  name: 'RegisterInput',
  description: 'Registration credentials',

  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('customerId');

    t.string('roleId');
  },
});

export const AuthenticateLambdaInput = inputObjectType({
  name: 'AuthenticateLambdaInput',
  definition(t) {
    t.string('authenticateEmail');
    t.string('workspaceEmail');
  },
});

export const AuthenticateLambda = mutationField('authenticateLambda', {
  type: 'String',
  args: { input: AuthenticateLambdaInput },
  async resolve(parent, args, ctx) {
    const authorizationHeader = ctx.req.header('lambda');
    if (!authorizationHeader) throw new GraphQLYogaError('No authorization header available');
    if (!args.input?.authenticateEmail) throw new GraphQLYogaError('No authenticate email provided');
    if (!args.input?.workspaceEmail) throw new GraphQLYogaError('No workspace email provided');
    const token = await ctx.services.authService.getWorkspaceAuthorizationToken(authorizationHeader, args.input.workspaceEmail);
    return token || null;
  },
})

export const CreateAutomationToken = mutationField('createAutomationToken', {
  type: 'String',
  args: { 'email': 'String' },

  async resolve(parent, args, ctx) {
    if (!args.email) throw new GraphQLYogaError('No email address provided!');
    return ctx.services.authService.createAutomationToken(args.email, 262974);
  },
});

export const RegisterMutation = mutationField('register', {
  type: 'String',
  args: { input: RegisterInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new ApolloError('Input information required');
    const user = await ctx.services.authService.registerUser(args.input);

    return {

    } as any;
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  description: 'Login credential',

  definition(t) {
    t.nonNull.string('email');
  },
});

export const AuthOutput = objectType({
  name: 'LoginOutput',
  description: 'Information you get after you log out',

  definition(t) {
    t.string('token');
    t.int('expiryDate');

    t.field('user', { type: UserType });
  },
});

export const VerifyUserTokenOutput = objectType({
  name: 'VerifyUserTokenOutput',

  definition(t) {
    t.string('accessToken');
    t.int('accessTokenExpiry');
    t.field('userData', { type: UserType });
  },
});

export const VerifyUserTokenMutation = mutationField('verifyUserToken', {
  description: 'Given a token, checks in the database whether token has been set and has not expired yet',
  type: VerifyUserTokenOutput,
  args: { token: 'String' },

  async resolve(parent, args, ctx) {
    if (!args.token) throw new GraphQLYogaError('No token could be found');

    const decodedToken = verifyAndDecodeToken(args.token) as any;
    const validUsers = await ctx.services.userService.getValidUsers(args.token, decodedToken?.id)

    // Check edge cases
    if (!validUsers.length) throw new GraphQLYogaError('No token has been found for this user');
    if (validUsers.length > 1) throw new GraphQLYogaError('Internal server error. Please try again later');

    // Check whether expiration-date is still valid.
    const [validUser] = validUsers;

    if (!decodedToken.exp) throw new GraphQLYogaError('Your token is invalid. Please request a new token.');
    if (new Date(decodedToken.exp) > new Date(Date.now())) throw new ApolloError('Your token has expired. Please request a new token.');

    const minutesInAMonth = 43000;
    const refreshToken = AuthService.createUserToken(validUser.id, minutesInAMonth);
    const accessToken = AuthService.createUserToken(validUser.id);
    const accessTokenExpiry = AuthService.getExpiryTimeFromToken(accessToken);

    // It seems all is good now. We can remove the token from the database, and set a refresh token on the user
    await ctx.services.userService.login(validUser.id, refreshToken);

    ctx.res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      userData: {
        ...validUser,
      },
      accessToken,
      accessTokenExpiry,
    };
  },
});

export const InviteUserOutput = objectType({
  name: 'InviteUserOutput',
  definition(t) {
    t.boolean('didInvite');
    t.boolean('didAlreadyExist');
  },
});

export const InviteUserInput = inputObjectType({
  name: 'InviteUserInput',
  definition(t) {
    t.nonNull.string('roleId');
    t.nonNull.string('email');
    t.nonNull.string('customerId');
    t.nonNull.boolean('sendInviteEmail');
  },
});

export const RequestInviteInput = inputObjectType({
  name: 'RequestInviteInput',
  definition(t) {
    t.nonNull.string('email');
  },
});

export const RequestInviteOutput = objectType({
  name: 'RequestInviteOutput',
  definition(t) {
    t.boolean('didInvite');
    t.boolean('userExists');
    t.string('loginToken');
  },
});

export const RequestInviteMutation = mutationField('requestInvite', {
  type: RequestInviteOutput,
  args: { input: RequestInviteInput },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args?.input?.email) throw new GraphQLYogaError('No email provided');
    const user = await ctx.services.userService.getUserByEmail(args.input.email);

    if (!user) return { didInvite: false, userExists: false };

    const loginToken = AuthService.createUserToken(user.id);
    await ctx.services.userService.setLoginToken(user.id, loginToken);

    const loginBody = makeSignInTemplate({
      recipientMail: user.email,
      token: loginToken,
    });

    mailService.send({
      body: loginBody,
      recipient: user.email,
      subject: 'Your HAAS Magic-link is ready!',
    });

    return {
      didInvite: true,
      userExists: true,
      loginToken: loginToken,
    };
  },
});

export const RefreshAccessTokenOutput = objectType({
  name: 'RefreshAccessTokenOutput',

  definition(t) {
    t.string('accessToken');
  },
});

export const RefreshAccessTokenQuery = queryField('refreshAccessToken', {
  type: RefreshAccessTokenOutput,

  async resolve(parent, args, ctx) {
    if (!ctx.session?.user?.id) throw new GraphQLYogaError('No verified user');
    const refreshTokenIsValid = await ctx.services.authService.verifyUserRefreshToken(ctx.session.user?.id);

    if (!refreshTokenIsValid) {
      throw new ApolloError('Unauthenticated', 'UNAUTHENTICATED');
    }

    const newToken = AuthService.createUserToken(ctx.session?.user?.id);
    await ctx.services.userService.updateLastSeen(ctx.session.user.id);

    return {
      accessToken: newToken,
    };
  },
});

export const LogoutMutation = mutationField('logout', {
  description: 'Logs a user out by removing their refresh token',
  type: 'String',

  async resolve(parent, args, ctx) {
    if (!ctx.session?.user?.id) throw new GraphQLYogaError('No user found');
    ctx.res.cookie('refresh_token', null);
    await ctx.services.userService.logout(ctx.session.user.id);

    return 'Logged out';
  },
});

export const InviteUserMutation = mutationField('inviteUser', {
  description: 'Invite a user to a particular customer domain, given an email and role',
  type: InviteUserOutput,
  args: { input: InviteUserInput },

  async resolve(parent, args, ctx: APIContext) {
    if (!args.input) throw new GraphQLYogaError('No input provided');
    const { customerId, email, roleId, sendInviteEmail } = args.input;

    // Check if email already has been created
    const user = await ctx.services.userService.findEmailWithinWorkspace(email, customerId);

    // Case 1: If user completely does not exist in our database yet,
    //  create a new entry and login-token
    if (!user) {
      await ctx.services.userService.inviteNewUserToCustomer(email, customerId, roleId, sendInviteEmail);

      return {
        didAlreadyExist: false,
        didInvite: true,
      };
    }

    // const [user] = users;

    // Case 2: If user-customer relation already exists,
    // just update the role itself
    if (user.customers.length) {
      await ctx.services.userService.updateUserRole(user.id, roleId, customerId, sendInviteEmail);

      return {
        didInvite: false,
        didAlreadyExist: true,
      };
    }

    // Case 3: Invite existing user to customer
    await ctx.services.userService.inviteExistingUserToCustomer(user.id, roleId, customerId, sendInviteEmail);

    return {
      didAlreadyExist: true,
      didInvite: true,
    };
  },
});
