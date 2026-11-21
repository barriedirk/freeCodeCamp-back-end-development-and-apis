import fs from "fs";
import path from "path";

const STORE_PATH = path.join(
  import.meta.dirname,
  "../data/refresh-tokens.json",
);

function readRecords(storePath) {
  if (!fs.existsSync(storePath)) {
    return [];
  }

  const records = JSON.parse(fs.readFileSync(storePath, "utf-8"));

  if (!Array.isArray(records)) {
    throw new Error("Refresh token store must contain an array");
  }

  return records;
}

function writeRecords(records, storePath) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });

  fs.writeFileSync(storePath, JSON.stringify(records));
}

function removeExpiredRecords(records) {
  const now = Date.now();

  return records.filter(({ expiresAt }) => expiresAt > now);
}

export function addRefreshToken(record, storePath = STORE_PATH) {
  const records = removeExpiredRecords(readRecords(storePath));

  records.push(record);

  writeRecords(records, storePath);
}

export function rotateRefreshToken(
  tokenId,
  replacement,
  storePath = STORE_PATH,
) {
  const records = removeExpiredRecords(readRecords(storePath));
  const current = records.find(({ id }) => id === tokenId);

  if (!current) {
    return "unknown";
  }

  if (current.status === "used") {
    for (const record of records) {
      if (record.sessionId === current.sessionId) {
        record.status = "revoked";
      }
    }

    writeRecords(records, storePath);

    return "reused";
  }

  if (current.status !== "active") {
    return "inactive";
  }

  current.status = "used";
  records.push(replacement);
  writeRecords(records, storePath);
  return "rotated";
}

export function revokeRefreshSession(sessionId, storePath = STORE_PATH) {
  const records = removeExpiredRecords(readRecords(storePath));
  let changed = false;

  for (const record of records) {
    if (record.sessionId === sessionId && record.status !== "revoked") {
      record.status = "revoked";
      changed = true;
    }
  }

  if (changed) {
    writeRecords(records, storePath);
  }
}

export function isRefreshSessionActive(sessionId, storePath = STORE_PATH) {
  const records = removeExpiredRecords(readRecords(storePath));

  return records.some(
    (record) => record.sessionId === sessionId && record.status === "active",
  );
}
