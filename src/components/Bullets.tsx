import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { Slot } from '@/lib/lists';
import { colors, fonts } from '@/theme';

type Props = {
  slots: Slot[];
  accent: string;
  onText: (i: number, text: string) => void;
  onToggle: (i: number) => void;
};

/** Ten bullet rows: type on a line, tap its dot to check it off. */
export function Bullets({ slots, accent, onText, onToggle }: Props) {
  return (
    <View style={styles.list}>
      {slots.map((s, i) => {
        const hasText = !!s.text.trim();
        return (
          <View key={i} style={styles.row}>
            <Pressable
              hitSlop={12}
              disabled={!hasText}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggle(i);
              }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: s.done, disabled: !hasText }}
              accessibilityLabel={hasText ? `Mark "${s.text}" ${s.done ? 'not done' : 'done'}` : 'Empty line'}
              style={styles.dotHit}
            >
              <View style={[styles.dot, s.done && { backgroundColor: accent, transform: [{ scale: 1.5 }] }]} />
            </Pressable>
            <TextInput
              value={s.text}
              onChangeText={(t) => onText(i, t)}
              placeholder={i === 0 && !hasText ? 'add a goal…' : undefined}
              placeholderTextColor="#B7B0AC"
              style={[styles.input, s.done && styles.done]}
              returnKeyType="next"
              submitBehavior="blurAndSubmit"
              maxLength={60}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 40 },
  row: { flexDirection: 'row', alignItems: 'center', height: 34 },
  dotHit: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ink },
  input: { flex: 1, fontFamily: fonts.mono, fontSize: 17, color: colors.ink, paddingVertical: 4 },
  done: { textDecorationLine: 'line-through', color: '#9C9490' },
});
