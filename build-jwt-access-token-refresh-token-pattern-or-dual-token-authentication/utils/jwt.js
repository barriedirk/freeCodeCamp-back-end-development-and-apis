import jwt from "jsonwebtoken";
import { createHmac, randomUUID } from "crypto";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

function getAccessSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

function getRefreshSecret() {
  if (process.env.JWT_REFRESH_SECRET) {
    return process.env.JWT_REFRESH_SECRET;
  }

  return createHmac("sha256", getAccessSecret())
    .update("refresh-token-signing-key")
    .digest();
}

export function signAccessToken(payload) {
  return jwt.sign({ ...payload, tokenType: "access" }, getAccessSecret(), {
    expiresIn: ACCESS_TOKEN_TTL,
    audience: "api",
  });
}

export function signRefreshToken(payload) {
  return jwt.sign({ ...payload, tokenType: "refresh" }, getRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    audience: "refresh",
  });
}

export function verifyAccessToken(token) {
  const secret = getAccessSecret();

  try {
    const payload = jwt.verify(token, secret, { audience: "api" });
    return payload.tokenType === "access" ? payload : null;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token) {
  const secret = getRefreshSecret();

  try {
    const payload = jwt.verify(token, secret, { audience: "refresh" });
    return payload.tokenType === "refresh" ? payload : null;
  } catch {
    return null;
  }
}

export function createTokenPair(user, sessionId) {
  const claims = {
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId,
  };
  const refreshTokenId = randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_TTL_SECONDS;

  return {
    accessToken: signAccessToken(claims),
    refreshToken: signRefreshToken({
      ...claims,
      jti: refreshTokenId,
    }),
    refreshTokenRecord: {
      id: refreshTokenId,
      sessionId,
      userId: user.id,
      status: "active",
      expiresAt: expiresAt * 1000,
    },
  };
}
