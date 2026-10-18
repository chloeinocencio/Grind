import { router } from 'expo-router';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PillButton } from '@/components/PillButton';
import { Title } from '@/components/Title';
import { colors } from '@/theme';

export default function Home() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ringW = width * 0.72;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 64 }]}>
      <Image
        source={require('../../assets/art/ring.png')}
        style={[styles.ring, { width: ringW, height: ringW * (1560 / 2385) }]}
        resizeMode="contain"
      />
      <Title size={92} subtitle="Fuel your focus">
        GRIND
      </Title>
      <View style={styles.buttons}>
        <PillButton label="daily goal" onPress={() => router.push('/daily')} />
        <PillButton label="ongoing" onPress={() => router.push('/ongoing')} />
        <PillButton label="pomodoro" onPress={() => router.push('/pomodoro')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  ring: { position: 'absolute', right: 0, bottom: 0 },
  buttons: { marginTop: 56, paddingHorizontal: 40, gap: 22 },
});
