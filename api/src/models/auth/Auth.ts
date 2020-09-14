import { inputObjectType, mutationField, objectType, queryField, unionType } from '@nexus/schema';

import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import { UserInput, UserType } from '../users/User';
import { mailService } from '../../services/mailings/MailService';
import { resolve } from 'path';
import AuthService from './AuthService';
import UserService from '../users/UserService';
import makeSignInTemplate from '../../services/mailings/templates/makeSignInTemplate';
import prisma from '../../config/prisma';
import verifyAndDecodeToken from './verifyAndDecodeToken';

export const RegisterInput = inputObjectType({
  name: 'RegisterInput',
  description: 'Registration credentials',

  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
    t.string('firstName', { required: true });
    t.string('lastName', { required: true });
    t.string('customerId', { required: true });

    t.string('roleId');
  },
});

export const RegisterMutation = mutationField('register', {
  type: 'String',
  nullable: true,
  args: { input: RegisterInput },

  async resolve(parent, args) {
    if (!args.input) throw new ApolloError('Input information required');
    const user = await AuthService.registerUser(args.input);

    return {

    } as any;
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  description: 'Login credential',

  definition(t) {
    t.string('email', { required: true });
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
    if (!args.token) throw new UserInputError('No token could be found');
    const decodedToken = verifyAndDecodeToken(args.token) as any;

    const validUsers = await ctx.prisma.user.findMany({
      where: { AND: {
        loginToken: {
          equals: args.token,
        },
        id: { equals: decodedToken?.id },
      } },
      include: {
        customers: {
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });

    // Check edge cases
    if (!validUsers.length) throw new ApolloError('No token has been found for this user');
    if (validUsers.length > 1) throw new Error('Internal server error. Please try again later');

    // Check whether expiration-date is still valid.
    const [validUser] = validUsers;

    if (!decodedToken.exp) throw new ApolloError('Your token is invalid. Please request a new token.');
    if (new Date(decodedToken.exp) > new Date(Date.now())) throw new ApolloError('Your token has expired. Please request a new token.');

    const minutesInAMonth = 43000;
    const refreshToken = AuthService.createUserToken(validUser.id, minutesInAMonth);
    const accessToken = AuthService.createUserToken(validUser.id);
    const accessTokenExpiry = AuthService.getExpiryTimeFromToken(accessToken);

    // It seems all is good now. We can remove the token from the database, and set a refresh token on the user
    await prisma.user.update({
      where: { id: validUser.id },
      data: {
        refreshToken,
        loginToken: null,
      },
    });

    ctx.res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return {
      userData: validUser,
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
    t.string('roleId', { required: true });
    t.string('email', { required: true });
    t.string('customerId', { required: true });
  },
});

export const RequestInviteInput = inputObjectType({
  name: 'RequestInviteInput',
  definition(t) {
    t.string('email', { required: true });
  },
});

export const RequestInviteOutput = objectType({
  name: 'RequestInviteOutput',

  definition(t) {
    t.boolean('didInvite');
  },
});

export const RequestInviteMutation = mutationField('requestInvite', {
  type: RequestInviteOutput,
  args: { input: RequestInviteInput },

  async resolve(parent, args, ctx) {
    if (!args?.input?.email) throw new UserInputError('No email provided');

    const users = await ctx.prisma.user.findMany({
      where: { email: args.input.email },
    });

    if (!users.length) return { didInvite: false };

    const [user] = users;

    const loginToken = AuthService.createUserToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { loginToken },
    });

    const loginBody = makeSignInTemplate({
      recipientMail: user.email,
      token: loginToken,
    });

    mailService.send({
      body: loginBody,
      recipient: user.email,
      subject: 'Sign in to HAAS!',
    });

    return {
      didInvite: true,
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
    if (!ctx.session?.userId) throw new ApolloError('Please log in again');
    const newToken = AuthService.createUserToken(ctx.session?.userId);

    return {
      accessToken: newToken,
    };
  },
});

export const InviteUserMutation = mutationField('inviteUser', {
  description: 'Invite a user to a particular customer domain, given an email and role',
  type: InviteUserOutput,
  args: { input: InviteUserInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input provided');
    const { customerId, email, roleId } = args.input;

    // Check if email already has been created
    const users = await ctx.prisma.user.findMany({
      where: { email },
      include: {
        customers: {
          where: { customerId },
          include: {
            customer: true,
            role: true,
          },
        },
      },
    });

    // If user completely does not exist in our database yet, create a new entry and login-token
    if (!users.length) {
      await UserService.inviteNewUserToCustomer(email, customerId, roleId);

      return {
        didAlreadyExist: false,
        didInvite: true,
      };
    }

    const [user] = users;

    // It exists
    if (user.customers.length) {
      return {
        didInvite: false,
        didAlreadyExist: true,
      };
    }

    await UserService.inviteExistingUserToCustomer(user, customerId, roleId);

    return {
      didAlreadyExist: true,
      didInvite: true,
    };
  },
});
