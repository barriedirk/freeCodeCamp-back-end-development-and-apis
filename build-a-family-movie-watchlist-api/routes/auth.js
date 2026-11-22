import express from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

import { findByUsername } from '../utils/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid credentials"
    })
  }

  const user = findByUsername(username);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return res.status(401).json({
      message: 'Invalid credentials'
    })
  }

  const token = signToken(
    {
     id: user.id,
     name: user.name,
     username: user.username,
     role: user.role
    }
  );

  return res.status(200).json({ token });
});

export default router