export const colors = {
  ink: '#39302C',
  paper: '#F1F0EC',
  white: '#FFFFFF',
  pill: '#E4E4E4',
  matcha: '#65801A',
  coffee: '#6B3A22',
  rule: '#111111',
};

export const fonts = {
  display: 'PassionOne_900Black',
  mono: 'RobotoMono_400Regular',
  monoMedium: 'RobotoMono_500Medium',
};

/** When reminders fire (24h local time). */
export const reminderTimes = {
  dailyFill: { hour: 9, minute: 0 },
  weeklyPlan: { hour: 18, minute: 0 },
  /** Days after Sunday to re-nag while the weekly list is still empty. */
  weeklyNagOffsets: [2, 4],
};

export const pomodoro = {
  focusMinutes: 25,
  breakMinutes: 5,
};
