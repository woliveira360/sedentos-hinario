export interface ServiceDayPlan {
  /** Culto date as YYYY-MM-DD — plan expires after this day */
  date: string;
  /** Hymn numbers in order */
  hymnNumbers: number[];
}
