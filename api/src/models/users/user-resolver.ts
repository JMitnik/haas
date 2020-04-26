import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { prisma } from '../../generated/prisma-client';
import config from '../../config';

interface SignUpProps {
  email: string;
  password: string;
}

interface SignInProps {
  email: string;
  password: string;
}

class UserResolver {
  static async signup(obj: any, { password, email }: SignUpProps) {
    const emailTransformed = email.toLowerCase();
    // TODO: Ensure no other user exists with this email
    const existingUsers = await prisma.users({ where: { email: emailTransformed } });

    if (existingUsers) {
      throw new AuthenticationError('A user already exists with this email');
    }

    const user = await prisma.createUser({
      email: emailTransformed,
      password: await bcrypt.hash(password, 10),
    });

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1w' },
    );
  }

  static async login(obj: any, { password, email }: SignInProps) {
    const emailTransformed = email.toLowerCase();
    const users = await prisma.users({ where: { email: emailTransformed } });

    if (!users.length) {
      // TODO: Replace with generic
      throw new AuthenticationError('No user with that email');
    }

    // TODO: We need to be careful that if we return the first one, it HAS to be the one
    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AuthenticationError('Whoops, password does not match!');
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1w' },
    );
  }
}

export default UserResolver;
