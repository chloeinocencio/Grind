import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme';

export function BackButton() {
  const { top } = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      hitSlop={16}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={[styles.btn, { top: top + 6 }]}
    >
      <Text style={styles.text}>‹ back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { position: 'absolute', left: 18, zIndex: 10 },
  text: { fontFamily: fonts.mono, fontSize: 14, color: colors.ink, opacity: 0.55 },
});
