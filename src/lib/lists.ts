import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dayKey, weekKey } from './dates';

export const SLOTS = 10;

export type Slot = { text: string; done: boolean };
export type ListKind = 'daily' | 'ongoing';

type Stored = { slots: Slot[]; plannedWeek?: string };

const emptySlots = (): Slot[] => Array.from({ length: SLOTS }, () => ({ text: '', done: false }));

/** Daily lists start fresh each day; the ongoing list carries over. */
export function storageKey(kind: ListKind, now = new Date()) {
  return kind === 'daily' ? `grind:daily:${dayKey(now)}` : 'grind:ongoing';
}

export async function loadList(kind: ListKind, now = new Date()): Promise<Stored> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(kind, now));
    if (raw) {
      const parsed = JSON.parse(raw) as Stored;
      const slots = emptySlots().map((s, i) => parsed.slots?.[i] ?? s);
      return { ...parsed, slots };
    }
  } catch {}
  return { slots: emptySlots() };
}

export const isFilled = (slots: Slot[]) => slots.some((s) => s.text.trim().length > 0);

/** Share of written items that are checked off, 0..1. */
export function progress(slots: Slot[]) {
  const written = slots.filter((s) => s.text.trim());
  if (!written.length) return 0;
  return written.filter((s) => s.done).length / written.length;
}

type Listener = () => void;
const listeners = new Set<Listener>();
export function onListsChanged(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useList(kind: ListKind) {
  const [slots, setSlots] = useState<Slot[]>(emptySlots);
  const [ready, setReady] = useState(false);
  const key = useRef(storageKey(kind));
  const meta = useRef<Omit<Stored, 'slots'>>({});

  useEffect(() => {
    key.current = storageKey(kind);
    loadList(kind).then(({ slots, ...rest }) => {
      meta.current = rest;
      setSlots(slots);
      setReady(true);
    });
  }, [kind]);

  const save = useCallback(
    (next: Slot[]) => {
      setSlots(next);
      if (kind === 'ongoing' && isFilled(next)) meta.current.plannedWeek = weekKey();
      AsyncStorage.setItem(key.current, JSON.stringify({ ...meta.current, slots: next }))
        .then(() => listeners.forEach((l) => l()))
        .catch(() => {});
    },
    [kind],
  );

  const setText = (i: number, text: string) =>
    save(slots.map((s, j) => (j === i ? { text, done: text.trim() ? s.done : false } : s)));
  const toggle = (i: number) =>
    slots[i].text.trim() && save(slots.map((s, j) => (j === i ? { ...s, done: !s.done } : s)));

  return { slots, ready, setText, toggle, progress: progress(slots) };
}
