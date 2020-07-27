import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import RoleService from '../role/RoleService';
import config from '../../config';
import prisma from '../../prisma';

class AuthService {
  static async registerUser(userInput: NexusGenInputs['RegisterInput']) {
    const customerExists = prisma.customer.findOne({ where: { id: userInput.customerId } });
    if (!customerExists) throw new Error('Customer does not exist');

    const userExists = await prisma.user.findOne({ where: {
      customerId_email: {
        customerId: userInput.customerId,
        email: userInput.email,
      },
    } });

    if (userExists) throw new Error('User already exists');

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
        Customer: {
          connect: {
            id: userInput.customerId,
          },
        },
        role: {
          connect: {
            id: (await RoleService.fetchDefaultRoleForCustomer(userInput.customerId)).id,
          },
        },
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new Error('Unable to make user');

    return user;
  }

  static async createToken(userInfo: NexusGenFieldTypes['UserType']) {
    return jwt.sign({
      email: userInfo.email,
      role: userInfo.role?.name,
      test: 'test',
      permissions: userInfo.role?.nrPermissions,
    }, config.jwtSecret);
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
