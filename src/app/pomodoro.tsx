import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { Drink } from '@/components/Drink';
import { Title } from '@/components/Title';
import { colors, fonts, pomodoro } from '@/theme';

type Phase = 'focus' | 'break';
type Timer = { phase: Phase; endsAt: number | null; remainingMs: number };

const KEY = 'grind:pomodoro';
const NOTIF_ID = 'grind-pomodoro';
const total = (p: Phase) => (p === 'focus' ? pomodoro.focusMinutes : pomodoro.breakMinutes) * 60_000;
const fresh = (phase: Phase): Timer => ({ phase, endsAt: null, remainingMs: total(phase) });

const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

async function scheduleEnd(t: Timer) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID).catch(() => {});
  if (!t.endsAt) return;
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID,
    content:
      t.phase === 'focus'
        ? { title: 'break time! 🍵', body: `Nice focus. Take ${pomodoro.breakMinutes} minutes.`, data: { url: '/pomodoro' } }
        : { title: "Break's over", body: 'Back to the grind ☕', data: { url: '/pomodoro' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: t.endsAt },
  }).catch(() => {});
}

export default function Pomodoro() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [t, setT] = useState<Timer>(fresh('focus'));
  const [now, setNow] = useState(Date.now());

  // Restore a timer that was running when the app closed.
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => raw && setT(JSON.parse(raw))).catch(() => {});
  }, []);

  const update = (next: Timer) => {
    setT(next);
    setNow(Date.now());
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    scheduleEnd(next);
  };

  const running = t.endsAt !== null;
  const remaining = running ? Math.max(0, t.endsAt! - now) : t.remainingMs;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // Phase finished: focus rolls into an idle break, break back to idle focus.
  useEffect(() => {
    if (running && remaining <= 0) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const next = fresh(t.phase === 'focus' ? 'break' : 'focus');
      setT(next);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    }
  }, [running, remaining, t.phase]);

  const started = running || t.remainingMs < total(t.phase);
  const frac = remaining / total(t.phase);
  // Focus pours the matcha; the break is when you get to drink it.
  const level = t.phase === 'focus' ? 1 - frac : frac;

  const main = running ? 'pause' : started ? 'resume' : t.phase === 'break' ? 'start break' : 'start';
  const onMain = () =>
    running
      ? update({ ...t, endsAt: null, remainingMs: remaining })
      : update({ ...t, endsAt: Date.now() + t.remainingMs });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 36, paddingBottom: insets.bottom + 40 }]}>
      <BackButton />
      <Title size={92} subtitle="The Pomodoro Technique">
        TIMER
      </Title>

      <Pressable onPress={onMain} hitSlop={20} accessibilityRole="button" style={styles.mainBtn}>
        <Text style={styles.main}>{main}</Text>
      </Pressable>

      <View style={styles.center}>
        <Drink source={require('../../assets/art/matcha.png')} aspect={1317 / 981} level={level} width={Math.min(width * 0.3, 140)} />
      </View>

      <View style={styles.bottom}>
        {started ? (
          <>
            <Text style={styles.phase}>{t.phase}</Text>
            <Text style={styles.clock}>{mmss(remaining)}</Text>
            {!running && (
              <Pressable onPress={() => update(fresh(t.phase))} hitSlop={12} accessibilityRole="button">
                <Text style={styles.link}>reset</Text>
              </Pressable>
            )}
          </>
        ) : t.phase === 'focus' ? (
          <Pressable onPress={() => update(fresh('break'))} hitSlop={12} accessibilityRole="button">
            <Text style={styles.clock}>break time!</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => update(fresh('focus'))} hitSlop={12} accessibilityRole="button">
            <Text style={styles.link}>skip break</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  mainBtn: { alignSelf: 'center', marginTop: 64 },
  main: { fontFamily: fonts.mono, fontSize: 26, color: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { alignItems: 'center', minHeight: 90, gap: 4 },
  phase: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink, opacity: 0.5, letterSpacing: 2 },
  clock: { fontFamily: fonts.mono, fontSize: 17, color: colors.ink },
  link: { fontFamily: fonts.mono, fontSize: 14, color: colors.ink, opacity: 0.55, textDecorationLine: 'underline' },
});
