import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { NexusGenInputs } from '../../generated/nexus';
import RoleService from '../role/RoleService';
import config from '../../config/config';
import prisma from '../../config/prisma';

interface UserTokenProps {
  id: string;
  email: string;
}

class AuthService {
  static async registerUser(userInput: NexusGenInputs['RegisterInput']) {
    const customerExists = prisma.customer.findOne({ where: { id: userInput.customerId } });
    if (!customerExists) throw new UserInputError('Customer does not exist');

    const userExists = await prisma.user.findMany({
      where: {
        customers: {
          some: {
            AND: [{
              customerId: userInput.customerId,
            }, {
              user: {
                email: userInput.email,
              },
            }],
          },
        },
      },
    });

    if (userExists.length) throw new UserInputError('User already exists');

    const hashedPassword = await AuthService.generatePassword(userInput.password);

    if (!userInput.roleId) {
      RoleService.fetchDefaultRoleForCustomer(userInput.customerId);
    }

    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        password: hashedPassword,
        customers: {
          create: {
            customer: { connect: { id: userInput.customerId || undefined } },
            role: { connect: { id: (await RoleService.fetchDefaultRoleForCustomer(userInput.customerId)).id || undefined } },
          },
        },
      },
      include: {
        customers: {
          include: {
            role: true,
            customer: true,
          },
        },
      },
    });

    if (!user) throw new Error('Unable to make user');

    return user;
  }

  static async verifyUserRefreshToken(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findOne({
        where: { id: userId },
      });

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
      // 5 minutes
      exp: Math.floor(Date.now() / 1000) + (tokenMinutes * 60),
    }, config.jwtSecret);
  }

  static async createToken(userInput: UserTokenProps) {
    return jwt.sign({
      email: userInput.email,
      id: userInput.id,
      // 5 minutes
      exp: Math.floor(Date.now() / 1000) + (30 * 60),
    }, config.jwtSecret);
  }

  static getExpiryTimeFromToken(token: string): number {
    const decoded = jwt.decode(token);

    // @ts-ignore
    if (!decoded?.exp) throw new Error('Something is not right');

    // @ts-ignore
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
