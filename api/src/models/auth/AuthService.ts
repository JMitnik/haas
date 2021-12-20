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
import UserService from '../users/UserService';


class AuthService {
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

  /**
   * 
   * @param userInput the details of a user needed to register him/her/it
   * @returns the registered user
   */
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

  /**
   * 
   * @param userId the id of the target user
   * @returns a boolean indicating whether the user is verified or not
   */
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

  /**
  * 
  * @param emailAddress The email address of the target user (e.g. automations@haas.live)
  * @param duration the amount of time the token is valid for in minutes
  * @returns a JWT token
  */
  createAutomationToken(emailAddress: string, duration: number | null = null) {
    const tokenMinutes = duration || config.jwtExpiryMinutes;

    return jwt.sign({
      email: emailAddress,
      exp: Math.floor(Date.now() / 1000) + (tokenMinutes * 60),
    }, config.apiSecret);
  }

  /**
   * 
   * @param userId The id of the target user
   * @param duration the amount of time the token is valid for in minutes
   * @returns a JWT token
   */
  static createUserToken(userId: string, duration: number | null = null) {
    const tokenMinutes = duration || config.jwtExpiryMinutes;

    return jwt.sign({
      id: userId,
      exp: Math.floor(Date.now() / 1000) + (tokenMinutes * 60),
    }, config.jwtSecret);
  }

  /**
   * 
   * @param token a JWT token
   * @returns the amount of time until the JWT token is expired
   */
  static getExpiryTimeFromToken(token: string): number {
    const decoded = jwt.decode(token) as any;

    if (!decoded?.exp) throw new ApolloError('Decoded expiry is missing');
    return decoded.exp;
  }

  /**
   * 
   * @param passwordInput A password in string format
   * @returns A hashed password
   */
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
