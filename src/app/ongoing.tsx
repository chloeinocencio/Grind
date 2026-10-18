import { Image, StyleSheet, View } from 'react-native';
import { ListScreen } from '@/components/ListScreen';
import { Title } from '@/components/Title';
import { colors } from '@/theme';

export default function Ongoing() {
  return (
    <ListScreen
      kind="ongoing"
      header={
        <View>
          <Title size={60}>ONGOING</Title>
          <Image
            source={require('../../assets/art/matcha-script.png')}
            style={styles.script}
            resizeMode="contain"
            accessibilityLabel="Matcha"
          />
        </View>
      }
      stain={{ source: require('../../assets/art/matcha-dust.png'), style: { left: -10, top: 90, width: 240, height: 245 } }}
      drink={{ source: require('../../assets/art/matcha.png'), aspect: 1317 / 981 }}
      accent={colors.matcha}
      emptyHint="add this week's goals to whisk your matcha"
    />
  );
}

const styles = StyleSheet.create({
  script: { width: 150, height: 46, alignSelf: 'center', marginTop: -24, marginLeft: 40 },
});
