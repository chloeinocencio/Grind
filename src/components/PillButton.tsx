import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme';

type Props = { label: string; onPress: () => void };

/** The soft, raised pill from the home screen. */
export function PillButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.shadow, pressed && styles.pressed]}
    >
      <LinearGradient colors={['#F7F7F7', colors.pill, '#D9D9D9']} locations={[0, 0.35, 1]} style={styles.pill}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pressed: { transform: [{ translateY: 3 }], shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
  pill: {
    height: 70,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#FFFFFF',
  },
  label: { fontFamily: fonts.mono, fontSize: 20, color: colors.ink },
});
