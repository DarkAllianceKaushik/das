const REPORT_KEY = "da_reports";

export interface Report {
  scriptId: string;
  reason: string;
  detail: string;
  createdAt: string;
}

export function submitReport(scriptId: string, reason: string, detail: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(REPORT_KEY);
    const reports: Report[] = raw ? JSON.parse(raw) : [];
    reports.push({
      scriptId,
      reason,
      detail,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(REPORT_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export function getReports(): Report[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPORT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
