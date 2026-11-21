import express from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { findByEmail, findById, writeUsers, readUsers } from "../utils/db.js";
import { createTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import authenticate from "../middleware/authenticate.js";
import { blacklistToken } from "../utils/token-blacklist.js";
import {
  addRefreshToken,
  revokeRefreshSession,
  rotateRefreshToken,
} from "../utils/refresh-token-store.js";

const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({
    user: req.user,
  });
});

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const emailFounded = findByEmail(email);

  if (emailFounded) {
    return res.status(409).json({
      message: "Email already in use",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: randomUUID(),
    email,
    passwordHash,
    role: "user",
  };

  writeUsers([...readUsers(), user]);

  const tokens = createTokenPair(user, randomUUID());
  addRefreshToken(tokens.refreshTokenRecord);

  res.status(201).json({
    message: "User registered successfully",
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const user = findByEmail(email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const tokens = createTokenPair(user, randomUUID());
  addRefreshToken(tokens.refreshTokenRecord);

  return res.status(200).json({
    message: "Login successful",
    token: tokens.accessToken,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.body?.refreshToken;
  const payload =
    typeof refreshToken === "string" ? verifyRefreshToken(refreshToken) : null;

  if (!payload || !payload.jti || !payload.sessionId) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = findById(payload.id);
  if (!user) {
    revokeRefreshSession(payload.sessionId);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  const tokens = createTokenPair(user, payload.sessionId);
  const rotationResult = rotateRefreshToken(
    payload.jti,
    tokens.refreshTokenRecord,
  );

  if (rotationResult !== "rotated") {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  return res.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
});

router.post("/logout", authenticate, (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  blacklistToken(token);
  if (req.authSessionId) {
    revokeRefreshSession(req.authSessionId);
  }

  res.json({ message: "Logged out successfully" });
});

export default router;
