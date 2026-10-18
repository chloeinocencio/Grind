import type { ReactNode } from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { Bullets } from '@/components/Bullets';
import { Drink } from '@/components/Drink';
import { type ListKind, useList } from '@/lib/lists';
import { colors, fonts } from '@/theme';

type Props = {
  kind: ListKind;
  header: ReactNode;
  stain: { source: ImageSourcePropType; style: object };
  drink: { source: ImageSourcePropType; aspect: number };
  accent: string;
  emptyHint: string;
};

export function ListScreen({ kind, header, stain, drink, accent, emptyHint }: Props) {
  const { slots, setText, toggle, progress } = useList(kind);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const written = slots.filter((s) => s.text.trim()).length;
  const done = slots.filter((s) => s.text.trim() && s.done).length;

  const caption = !written ? emptyHint : done === written ? 'all done — enjoy! ✨' : `${done} of ${written} done`;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackButton />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 36, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {header}
        <View style={styles.listArea}>
          <Image source={stain.source} style={[styles.stain, stain.style]} resizeMode="contain" />
          <Bullets slots={slots} accent={accent} onText={setText} onToggle={toggle} />
        </View>
        <View style={styles.rule} />
        <View style={styles.drink}>
          <Drink source={drink.source} aspect={drink.aspect} level={progress} width={Math.min(width * 0.32, 150)} />
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  listArea: { marginTop: 28, paddingBottom: 24 },
  stain: { position: 'absolute', opacity: 0.9 },
  rule: { height: 1.5, backgroundColor: colors.rule, marginTop: 8 },
  drink: { alignItems: 'center', paddingTop: 24 },
  caption: { fontFamily: fonts.mono, fontSize: 14, color: colors.ink, marginTop: 12, opacity: 0.7 },
});
