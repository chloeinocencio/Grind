# GRIND — fuel your focus

A planning app where your drink fills up as you finish your goals.

- **Daily goal** — today's list. Check items off and the iced coffee fills. Starts fresh each day.
- **Ongoing** — your list for the week. Check items off and the matcha fills.
- **Pomodoro** — 25-minute focus / 5-minute break timer. The matcha pours while you focus and drains on your break.

## Reminders (iOS local notifications)

- **Every morning (9:00)** — "fill your cup". Skipped for today once today's list has something on it.
- **Sunday evening (18:00)** — "plan your week".
- **Tuesday and Thursday (18:00)** — re-reminders while the week's ongoing list hasn't been touched.
- Pomodoro alerts when a focus or break session ends, even with the app closed.

Notifications can't check the app when they fire, so the schedule is rebuilt whenever the app opens or a list changes. Times live in `src/theme.ts` (`reminderTimes`, `pomodoro`).

Tapping a reminder opens the screen it's about.

## Run it on your iPhone

```bash
npm install
npx expo start
```

Scan the QR code with the Camera app to open it in **Expo Go**. Local notifications work in Expo Go; for a real install, build with EAS: `npx eas-cli@latest build -p ios`.

## Project layout

```
src/app/          screens (Expo Router): index, daily, ongoing, pomodoro
src/components/   Title, PillButton, Bullets, Drink (the fill effect), ListScreen
src/lib/          lists (storage), reminders, dates
assets/art/       drink art and paper textures
```

## Swapping the art

The images in `assets/art/` were cut from the design mockups as placeholders. Drop in the originals with the same file names. If a drink's proportions change, update its `aspect` (height ÷ width) in `src/app/daily.tsx`, `ongoing.tsx` and `pomodoro.tsx`.
