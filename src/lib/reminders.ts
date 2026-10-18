import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { reminderTimes } from '@/theme';
import { at, weekKey, weekStart } from './dates';
import { isFilled, loadList } from './lists';

const PREFIX = 'grind-reminder-';

export async function ensurePermission() {
  if (Platform.OS === 'web') return false;
  let perm = await Notifications.getPermissionsAsync();
  if (perm.ios?.status === Notifications.IosAuthorizationStatus.NOT_DETERMINED) {
    perm = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: false, allowSound: true },
    });
  }
  return (
    perm.granted ||
    perm.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    perm.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * Local notifications can't check app state when they fire, so instead we
 * rebuild the whole reminder schedule whenever the app opens or a list
 * changes, leaving out anything that's already been taken care of.
 *
 * - Daily: a nudge each morning for the next 7 days; today's is dropped once
 *   today's list has something in it.
 * - Weekly: Sunday evening "plan your week", then re-nags (Tue, Thu) while the
 *   ongoing list hasn't been touched that week. Next week's set is always
 *   queued so the reminders keep coming even if the app isn't opened.
 */
export async function syncReminders(now = new Date()) {
  if (!(await ensurePermission())) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );

  const [daily, ongoing] = await Promise.all([loadList('daily', now), loadList('ongoing', now)]);
  const jobs: Promise<string>[] = [];
  const add = (id: string, date: Date, title: string, body: string, url: string) => {
    if (date <= now) return;
    jobs.push(
      Notifications.scheduleNotificationAsync({
        identifier: PREFIX + id,
        content: { title, body, data: { url } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      }),
    );
  };

  const { hour: dh, minute: dm } = reminderTimes.dailyFill;
  for (let i = 0; i < 7; i++) {
    if (i === 0 && isFilled(daily.slots)) continue;
    const when = at(now, dh, dm, i);
    add(`daily-${i}`, when, 'Fill your cup ☕', "What's on today's list?", '/daily');
  }

  const { hour: wh, minute: wm } = reminderTimes.weeklyPlan;
  const thisWeek = weekStart(now);
  const plannedThisWeek = ongoing.plannedWeek === weekKey(now);
  for (const offset of [0, 7]) {
    if (offset === 0 && plannedThisWeek) continue;
    add(`week-${offset}-plan`, at(thisWeek, wh, wm, offset), 'Plan your week 🍵', 'Fill your ongoing list for the week ahead.', '/ongoing');
    for (const nag of reminderTimes.weeklyNagOffsets) {
      add(`week-${offset}-nag-${nag}`, at(thisWeek, wh, wm, offset + nag), 'Your week is still empty', "Your matcha's waiting — add this week's goals.", '/ongoing');
    }
  }

  await Promise.all(jobs);
}
