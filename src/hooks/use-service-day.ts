import { useCallback, useEffect, useState } from "react";
import type { ServiceDayPlan } from "@/types/service-day";
import {
  clearServiceDay,
  createEmptyPlan,
  loadServiceDay,
  saveServiceDay,
} from "@/lib/service-day";

export function useServiceDay() {
  const [plan, setPlan] = useState<ServiceDayPlan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlan(loadServiceDay());
    setReady(true);
  }, []);

  const persist = useCallback((next: ServiceDayPlan) => {
    saveServiceDay(next);
    setPlan(next);
  }, []);

  const setDate = useCallback(
    (date: string) => {
      persist({ ...(plan ?? createEmptyPlan(date)), date });
    },
    [plan, persist],
  );

  const addHymn = useCallback(
    (number: number) => {
      const base = plan ?? createEmptyPlan();
      if (base.hymnNumbers.includes(number)) return;
      persist({ ...base, hymnNumbers: [...base.hymnNumbers, number] });
    },
    [plan, persist],
  );

  const removeHymn = useCallback(
    (number: number) => {
      if (!plan) return;
      persist({
        ...plan,
        hymnNumbers: plan.hymnNumbers.filter((n) => n !== number),
      });
    },
    [plan, persist],
  );

  const moveHymn = useCallback(
    (number: number, direction: -1 | 1) => {
      if (!plan) return;
      const idx = plan.hymnNumbers.indexOf(number);
      if (idx < 0) return;
      const nextIdx = idx + direction;
      if (nextIdx < 0 || nextIdx >= plan.hymnNumbers.length) return;
      const hymnNumbers = [...plan.hymnNumbers];
      [hymnNumbers[idx], hymnNumbers[nextIdx]] = [
        hymnNumbers[nextIdx],
        hymnNumbers[idx],
      ];
      persist({ ...plan, hymnNumbers });
    },
    [plan, persist],
  );

  const clear = useCallback(() => {
    clearServiceDay();
    setPlan(null);
  }, []);

  return {
    plan,
    ready,
    setDate,
    addHymn,
    removeHymn,
    moveHymn,
    clear,
  };
}
