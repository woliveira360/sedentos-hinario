import type { ServiceDayPlan } from "@/types/service-day";

const STORAGE_KEY = "hcc-service-day";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** True when calendar day is after the plan date (plan expired). */
export function isPlanExpired(date: string, now = todayISO()): boolean {
  return now > date;
}

export function loadServiceDay(): ServiceDayPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const plan = JSON.parse(raw) as ServiceDayPlan;
    if (!plan?.date || !Array.isArray(plan.hymnNumbers)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (isPlanExpired(plan.date)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      date: plan.date,
      hymnNumbers: plan.hymnNumbers.filter((n) => typeof n === "number"),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveServiceDay(plan: ServiceDayPlan): void {
  if (isPlanExpired(plan.date)) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function clearServiceDay(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createEmptyPlan(date = todayISO()): ServiceDayPlan {
  return { date, hymnNumbers: [] };
}

export { todayISO };
