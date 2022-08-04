import jwt from 'jsonwebtoken';

import config from '../../config/config';

const verifyAndDecodeToken = (token: string) => {
  const decodedToken = jwt.verify(token, config.jwtSecret);

  return decodedToken;
};

export default verifyAndDecodeToken;
