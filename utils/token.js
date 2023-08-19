import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const signToken = (id, secret) => {
  return jwt.sign({ id }, secret, {
    expiresIn: 60 * 60 * 1000, // 1hr
  });
};

export const verifyToken = async (token, secret) => {
  return await promisify(jwt.verify)(token, secret);
};
