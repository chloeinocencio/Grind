import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts } from '@/theme';

/** `size` is the font size on a 390pt-wide phone; it scales with the screen. */
type Props = { children: string; subtitle?: string; size?: number };

export function Title({ children, subtitle, size = 92 }: Props) {
  const { width } = useWindowDimensions();
  const s = size * Math.min(Math.max(width / 390, 0.85), 1.15);
  return (
    <View style={styles.wrap}>
      <Text
        style={[styles.title, { fontSize: s, lineHeight: s * 0.86, letterSpacing: -0.02 * s }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        accessibilityRole="header"
      >
        {children}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 12 },
  // Passion One sits high in its line box; nudge it down so caps look centered.
  title: { fontFamily: fonts.display, color: colors.ink, textAlign: 'center', paddingTop: 4 },
  subtitle: { fontFamily: fonts.mono, color: colors.ink, fontSize: 16, marginTop: 2 },
});
