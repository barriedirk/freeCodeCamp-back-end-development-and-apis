import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  addRefreshToken,
  isRefreshSessionActive,
  revokeRefreshSession,
  rotateRefreshToken
} from '../utils/refresh-token-store.js';
import {
  createTokenPair,
  verifyAccessToken,
  verifyRefreshToken
} from '../utils/jwt.js';

function createStorePath() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-api-'));
  return {
    path: path.join(directory, 'refresh-tokens.json'),
    cleanup: () => fs.rmSync(directory, { recursive: true, force: true })
  };
}

test('refresh-token rotation is one-time and reuse revokes the session', () => {
  const store = createStorePath();

  try {
    const current = {
      id: 'old-token',
      sessionId: 'session-1',
      userId: 'user-1',
      status: 'active',
      expiresAt: Date.now() + 60_000
    };
    const replacement = {
      id: 'new-token',
      sessionId: 'session-1',
      userId: 'user-1',
      status: 'active',
      expiresAt: Date.now() + 60_000
    };
    addRefreshToken(current, store.path);

    assert.equal(
      rotateRefreshToken(current.id, replacement, store.path),
      'rotated'
    );
    assert.equal(isRefreshSessionActive(current.sessionId, store.path), true);
    assert.equal(
      rotateRefreshToken(
        current.id,
        { ...replacement, id: 'third-token' },
        store.path
      ),
      'reused'
    );

    const records = JSON.parse(fs.readFileSync(store.path, 'utf-8'));
    assert.deepEqual(records.map(({ status }) => status), ['revoked', 'revoked']);
    assert.equal(isRefreshSessionActive(current.sessionId, store.path), false);
    assert.equal(rotateRefreshToken(replacement.id, {}, store.path), 'inactive');
  } finally {
    store.cleanup();
  }
});

test('logout revokes all refresh tokens in the session', () => {
  const store = createStorePath();

  try {
    addRefreshToken({
      id: 'token-1',
      sessionId: 'session-1',
      status: 'active',
      expiresAt: Date.now() + 60_000
    }, store.path);
    addRefreshToken({
      id: 'token-2',
      sessionId: 'session-2',
      status: 'active',
      expiresAt: Date.now() + 60_000
    }, store.path);

    revokeRefreshSession('session-1', store.path);

    const records = JSON.parse(fs.readFileSync(store.path, 'utf-8'));
    assert.deepEqual(records.map(({ status }) => status), ['revoked', 'active']);
    assert.equal(isRefreshSessionActive('session-1', store.path), false);
    assert.equal(isRefreshSessionActive('session-2', store.path), true);
  } finally {
    store.cleanup();
  }
});

test('access and refresh tokens are distinct and only verify for their intended use', () => {
  process.env.JWT_SECRET = 'test-access-secret';
  delete process.env.JWT_REFRESH_SECRET;

  const tokens = createTokenPair(
    { id: 'user-1', email: 'user@example.com', role: 'user' },
    'session-1'
  );

  assert.equal(verifyAccessToken(tokens.accessToken).tokenType, 'access');
  assert.equal(verifyRefreshToken(tokens.refreshToken).tokenType, 'refresh');
  assert.equal(verifyAccessToken(tokens.refreshToken), null);
  assert.equal(verifyRefreshToken(tokens.accessToken), null);
});
