const STORAGE_KEY = "da_favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return false;
  }
  favs.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return true;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}
