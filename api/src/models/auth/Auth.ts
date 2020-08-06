import { inputObjectType, mutationField } from '@nexus/schema';

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
      role: role?.name || '',
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

export const LoginMutation = mutationField('login', {
  type: UserType,
  nullable: true,
  args: { input: LoginInput },

  async resolve(parent, args) {
    return null;
  },
});
