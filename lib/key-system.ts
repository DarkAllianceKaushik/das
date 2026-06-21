const KEY_STORAGE = "da_keys";

export interface LicenseKey {
  id: string;
  key: string;
  hwid?: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

export function generateKey(): LicenseKey {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 4; i++) {
    if (i > 0) key += "-";
    for (let j = 0; j < 4; j++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  const now = Date.now();
  return {
    id: `key_${now}`,
    key,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  };
}

export function getKeys(): LicenseKey[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveKeys(keys: LicenseKey[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_STORAGE, JSON.stringify(keys));
}

export function addKey(): LicenseKey {
  const keys = getKeys();
  const newKey = generateKey();
  keys.push(newKey);
  saveKeys(keys);
  return newKey;
}

export function revokeKey(id: string): void {
  const keys = getKeys().map(k => k.id === id ? { ...k, active: false } : k);
  saveKeys(keys);
}

export function validateKey(keyStr: string): boolean {
  const clean = keyStr.trim().toUpperCase();
  const keys = getKeys();
  const found = keys.find(k => k.key === clean);
  if (!found) return false;
  if (!found.active) return false;
  if (new Date(found.expiresAt) < new Date()) return false;
  return true;
}
