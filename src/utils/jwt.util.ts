import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ userId }, secret, { expiresIn });
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};
