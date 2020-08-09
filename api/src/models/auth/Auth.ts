import { inputObjectType, mutationField, objectType } from '@nexus/schema';

import { UserInputError } from 'apollo-server-express';
import { UserType } from '../users/User';
import AuthService from './AuthService';

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
    if (!args.input) throw new Error('Input information required');
    const user = await AuthService.registerUser(args.input);

    const role = user.customers.find((customer) => customer.customer.id === args.input?.customerId)?.role;
    const userToken = await AuthService.createToken({
      email: user.email,
      // role: role?.name || '',
      permissions: role?.permissions.map((permission) => permission.name) || [],
    });

    return userToken;
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

    t.field('user', { type: UserType });
  },
});

export const LoginMutation = mutationField('login', {
  type: AuthOutput,
  nullable: true,
  args: { input: LoginInput },

  async resolve(parent, args) {
    if (!args.input?.email) throw new UserInputError('login:email_missing');
    if (!args.input?.password) throw new UserInputError('login:password_missing');

    const user = await AuthService.loginUser({
      email: args.input?.email,
      password: args.input?.password,
    });

    const permissions = [
      user.isSuperAdmin ? 'SUPER_ADMIN' : '',
    ];

    const userToken = await AuthService.createToken({
      email: user.email,
      permissions,
    });

    return {
      token: userToken,
      user,
    };
  },
});
