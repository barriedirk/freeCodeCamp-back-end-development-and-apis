import { verifyAccessToken } from '../utils/jwt.js';
import { isBlacklisted } from '../utils/token-blacklist.js'
import { isRefreshSessionActive } from '../utils/refresh-token-store.js';

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

  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }

  if (user.sessionId && !isRefreshSessionActive(user.sessionId)) {
    return res.status(401).json({
      message: 'Token has been invalidated. Log in again.'
    });
  }

  const { id, email, role, sessionId } = user;
  req.user = { id, email, role };
  req.authSessionId = sessionId;

  next();
}

export default authenticate;