import jwt from 'jsonwebtoken';

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;

  return jwt.sign(payload, secret, {expiresIn: '1d'});
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}