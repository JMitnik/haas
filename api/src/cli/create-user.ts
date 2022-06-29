import inquirer from 'inquirer';

import prisma from '../config/prisma';
import UserService from '../models/users/UserService';

inquirer.prompt([
  {
    type: 'input',
    name: 'email',
    message: 'Enter your email',
  },
  {
    type: 'confirm',
    name: 'isAdmin',
    message: 'Is this user an admin?',
    default: false,
  },
  {
    type: 'input',
    name: 'firstName',
    message: 'Enter your first name',
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'Enter your last name',
  },
]).then(async (answers) => {
  const userService = new UserService(prisma);

  await userService.createUser(answers.email, answers.firstName, answers.lastName, answers.isAdmin);
}).then(() => {}).finally(() => {});
