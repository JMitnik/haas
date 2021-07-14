import { ApolloError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';

import { NexusGenInputs } from '../../generated/nexus';
import RoleService from '../role/RoleService';
import config from '../../config/config';
import { RegisterUserInput } from '../users/UserPrismaAdapterType';
import UserPrismaAdapter from '../users/UserPrismaAdapter';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import { AuthServiceType } from './AuthServiceType';
import UserService from '../users/UserService';


class AuthService implements AuthServiceType {
  prisma: PrismaClient<PrismaClientOptions, never>;
  customerPrismaAdapter: CustomerPrismaAdapter;
  userPrismaAdapter: UserPrismaAdapter;
  userService: UserService;
  roleService: RoleService;

  constructor(prismaClient: PrismaClient<PrismaClientOptions, never>) {
    this.prisma = prismaClient;
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prismaClient);
    this.userPrismaAdapter = new UserPrismaAdapter(prismaClient);
    this.userService = new UserService(prismaClient);
    this.roleService = new RoleService(prismaClient);
  }

  async registerUser(userInput: NexusGenInputs['RegisterInput']) {
    const customerExists = await this.customerPrismaAdapter.exists(userInput.customerId);

    if (!customerExists) throw new UserInputError('Customer does not exist');

    const userExists = await this.userPrismaAdapter.existsWithinWorkspace(userInput.email, userInput.customerId);

    if (userExists) throw new UserInputError('User already exists');

    const hashedPassword = await AuthService.generatePassword(userInput.password);

    if (!userInput.roleId) {
      this.roleService.fetchDefaultRoleForCustomer(userInput.customerId);
    }

    const registerUserInput: RegisterUserInput = {
      email: userInput.email,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      password: hashedPassword,
      workspaceId: userInput.customerId
    }

    const user = await this.userPrismaAdapter.registerUser(registerUserInput);

    if (!user) throw new Error('Unable to make user');

    return user;
  }

  async verifyUserRefreshToken(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user?.refreshToken) return false;
      jwt.verify(user?.refreshToken, config.jwtSecret);

      return true;
    } catch (e) {
      return false;
    }
  }

  static createUserToken(userId: string, duration: number | null = null) {
    const tokenMinutes = duration || config.jwtExpiryMinutes;

    return jwt.sign({
      id: userId,
      exp: Math.floor(Date.now() / 1000) + (tokenMinutes * 60),
    }, config.jwtSecret);
  }

  static getExpiryTimeFromToken(token: string): number {
    const decoded = jwt.decode(token) as any;

    if (!decoded?.exp) throw new ApolloError('Decoded expiry is missing');
    return decoded.exp;
  }

  static async checkPassword(inputPassword: string, dbPassword: string) {
    const res = await bcrypt.compare(inputPassword, dbPassword);

    return res;
  }

  static async generatePassword(passwordInput: string) {
    const hashedPassword: string = await new Promise((resolve, reject) => {
      bcrypt.hash(passwordInput, 12, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    return hashedPassword;
  }
}

export default AuthService;
