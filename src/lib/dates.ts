const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar day, e.g. "2026-10-17". */
export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Midnight of the Sunday that starts d's week (local time). */
export function weekStart(d = new Date()) {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  s.setDate(s.getDate() - s.getDay());
  return s;
}

export function weekKey(d = new Date()) {
  return dayKey(weekStart(d));
}

export function at(day: Date, hour: number, minute: number, addDays = 0) {
  const t = new Date(day.getFullYear(), day.getMonth(), day.getDate() + addDays);
  t.setHours(hour, minute, 0, 0);
  return t;
}
