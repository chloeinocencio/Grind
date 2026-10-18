import { RobotoMono_400Regular, RobotoMono_500Medium } from '@expo-google-fonts/roboto-mono';
import { RubikMonoOne_400Regular } from '@expo-google-fonts/rubik-mono-one';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { onListsChanged } from '@/lib/lists';
import { syncReminders } from '@/lib/reminders';

SplashScreen.preventAutoHideAsync().catch(() => {});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [loaded] = useFonts({ RubikMonoOne_400Regular, RobotoMono_400Regular, RobotoMono_500Medium });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  // Keep the reminder schedule in step with what's actually on the lists.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sync = () => syncReminders().catch(() => {});
    sync();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const offLists = onListsChanged(() => {
      clearTimeout(timer);
      timer = setTimeout(sync, 1500);
    });
    const appState = AppState.addEventListener('change', (s) => s === 'active' && sync());

    // Tapping a reminder opens the screen it's about.
    const open = (r: Notifications.NotificationResponse | null) => {
      const url = r?.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as never);
    };
    Notifications.getLastNotificationResponseAsync().then(open);
    const tapSub = Notifications.addNotificationResponseReceivedListener(open);

    return () => {
      clearTimeout(timer);
      offLists();
      appState.remove();
      tapSub.remove();
    };
  }, []);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  );
}
