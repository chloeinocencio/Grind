import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

type Props = { children: string; subtitle?: string; size?: number };

export function Title({ children, subtitle, size = 64 }: Props) {
  return (
    <View style={styles.wrap}>
      <Text
        style={[styles.title, { fontSize: size, lineHeight: size * 1.1 }]}
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
  wrap: { alignItems: 'center', paddingHorizontal: 16 },
  title: { fontFamily: fonts.display, color: colors.ink, letterSpacing: -2, textAlign: 'center' },
  subtitle: { fontFamily: fonts.mono, color: colors.ink, fontSize: 17, marginTop: 4 },
});
