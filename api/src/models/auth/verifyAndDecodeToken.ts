import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import config from '../../config/config';

type VerifyAndDecodeTokenOutput<T> = AuthenticationError | T | null;

const verifyAndDecodeToken = (token: string) => {
  const decodedToken = jwt.verify(token, config.jwtSecret);

  return decodedToken;
};

export default verifyAndDecodeToken;
