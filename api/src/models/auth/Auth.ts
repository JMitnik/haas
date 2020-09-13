import { inputObjectType, mutationField, objectType, queryField, unionType } from '@nexus/schema';

import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import { resolve } from 'path';
import { UserType } from '../users/User';
import AuthService from './AuthService';
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

    // const role = user.find((customer) => customer.customer.id === args.input?.customerId)?.role;
    // const userToken = await AuthService.createToken({
    //   email: user.email,
    //   // role: role?.name || '',
    //   permissions: role?.permissions.map((permission) => permission.name) || [],
    // });

    // return userToken;
    return {

    } as any;
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  description: 'Login credential',

  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
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

export const LoginMutation = mutationField('login', {
  type: AuthOutput,
  nullable: true,
  args: { input: LoginInput },

  async resolve(parent, args, ctx) {
    if (!args.input?.email) throw new UserInputError('login:email_missing');
    if (!args.input?.password) throw new UserInputError('login:password_missing');

    const user = await AuthService.loginUser({
      email: args.input?.email,
      password: args.input?.password,
    });

    const userToken = await AuthService.createToken({
      id: user.id,
      email: user.email,
    });

    const expiryDate = AuthService.getExpiryTimeFromToken(userToken);

    ctx.res.cookie('haas_token', userToken, {
      httpOnly: true,
    });

    return {
      expiryDate,
      token: userToken,
      user,
    };
  },
});

export const VerifyUserTokenMutation = mutationField('verifyUserToken', {
  description: 'Given a token, checks in the database whether token has been set and has not expired yet',
  type: UserType,
  args: { token: 'String' },

  async resolve(parent, args, ctx) {
    if (!args.token) throw new UserInputError('No token could be found');
    // const decodedToken = verifyAndDecodeToken(args.token);
    const decodedToken = '123123';

    const validUsers = await ctx.prisma.user.findMany({
      where: { loginToken: decodedToken },
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

    if (!validUser.loginTokenExpiry) throw new ApolloError('Your token is invalid. Please request a new token.');
    if (validUser.loginTokenExpiry > new Date(Date.now())) throw new ApolloError('Your token has expired. Please request a new token.');

    return validUser;
  },
});
