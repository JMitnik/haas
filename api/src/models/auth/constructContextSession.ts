import { AuthenticationError } from 'apollo-server-express';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import jwt from 'jsonwebtoken';

import { ContextSessionType } from './ContextSessionType';
import config from '../../config/config';
import prisma from '../../config/prisma';
import readBearerToken from './readBearerToken';

const constructContextSession = async (context: ExpressContext): Promise<ContextSessionType | null> => {
  // Support auth use-case if a token is supported using cookie (should be HTTP-only)
  const cookieToken: string | null = context.req.cookies?.token;
  console.log(cookieToken);

  // Support auth-use case if a token is submitted using a Bearer token
  const authHeader = context.req.headers.authorization || '';
  const bearerToken = readBearerToken(authHeader);

  // Prefer cookie-token over bearer-token
  const authToken = cookieToken || bearerToken || null;

  if (!authToken) return null;

  let isValid = null;
  try {
    isValid = jwt.verify(authToken, config.jwtSecret);
  } catch (e) {
    context.res.cookie('token', '');
    throw new AuthenticationError('UNAUTHENTICATED');
  }

  if (!isValid) return null;

  const decodedUser = jwt.decode(authToken);
  // @ts-ignore
  const decodedUserMail = decodedUser?.email;
  // @ts-ignore
  const decodedExpAt = decodedUser?.iat;

  if (!decodedUserMail) return null;
  if (!decodedExpAt) return null;

  const user = await prisma.user.findOne({
    where: {
      email: decodedUserMail,
    },
    include: {
      customers: {
        include: {
          customer: true,
          role: true,
        },
      },
    },
  });

  return {
    userId: user?.id,
    expiresAt: decodedExpAt,
    globalPermissions: user?.globalPermissions || [],
    token: authToken,
  };
};

export default constructContextSession;
