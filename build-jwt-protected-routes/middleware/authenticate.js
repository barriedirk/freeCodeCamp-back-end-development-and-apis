import { verifyToken } from '../utils/jwt.js';
import { isBlacklisted } from '../utils/token-blacklist.js'

function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authorization.split(' ')[1];

  if (isBlacklisted(token)) {
    return res.status(401).json({
      message: 'Token has been invalidated. Log in again.'
    })
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }

  req.user = user;

  next();
}

export default authenticate;