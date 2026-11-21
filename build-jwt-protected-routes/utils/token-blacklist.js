const blackList = new Set();

export function blacklistToken(token) {
  blackList.add(token);
}

export function isBlacklisted(token) {
  return blackList.has(token);
}