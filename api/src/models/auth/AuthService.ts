import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { NexusGenInputs } from '../../generated/nexus';
import RoleService from '../role/RoleService';
import config from '../../config';
import prisma from '../../prisma';

interface UserTokenProps {
  email: string;
  role: string;
  permissions: string[] | [];
}

class AuthService {
  static async registerUser(userInput: NexusGenInputs['RegisterInput']) {
    const customerExists = prisma.customer.findOne({ where: { id: userInput.customerId } });
    if (!customerExists) throw new Error('Customer does not exist');

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

    if (userExists.length) throw new Error('User already exists');

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
            role: {
              include: {
                permissions: true,
              },
            },
            customer: true,
          },
        },
      },
    });

    if (!user) throw new Error('Unable to make user');

    return user;
  }

  static async createToken(userInput: UserTokenProps) {
    return jwt.sign({
      email: userInput.email,
      role: userInput.role,
      test: 'test',
      permissions: userInput.permissions,
    }, config.jwtSecret);
  }

  static async loginUser(userInput: NexusGenInputs['LoginInput']) {
    const user = await prisma.user.findOne({ where: { email: userInput.email } });

    if (!user?.password) throw new Error('Something seems wrong with your account. Contact the admin for more info');

    const isValidPassword = AuthService.checkPassword(userInput.password, user?.password);

    if (!isValidPassword) throw new Error('Login credentials invalid');

    return user;
  }

  static async checkPassword(dbPassword: string, inputPassword: string) {
    return bcrypt.compare(inputPassword, dbPassword);
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
