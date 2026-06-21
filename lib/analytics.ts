const VIEW_KEY = "da_view_count";

export interface ViewData {
  [scriptId: string]: number;
}

export function trackView(scriptId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    const data: ViewData = raw ? JSON.parse(raw) : {};
    data[scriptId] = (data[scriptId] || 0) + 1;
    localStorage.setItem(VIEW_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getViewCount(scriptId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    const data: ViewData = raw ? JSON.parse(raw) : {};
    return data[scriptId] || 0;
  } catch {
    return 0;
  }
}

export function getAllViewData(): ViewData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
