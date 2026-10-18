import { ListScreen } from '@/components/ListScreen';
import { Title } from '@/components/Title';
import { colors } from '@/theme';

export default function Daily() {
  return (
    <ListScreen
      kind="daily"
      header={<Title size={60}>DAILY</Title>}
      stain={{ source: require('../../assets/art/splash.png'), style: { right: -20, top: -10, width: 300, height: 358 } }}
      drink={{ source: require('../../assets/art/coffee.png'), aspect: 1757 / 953 }}
      accent={colors.coffee}
      emptyHint="write today's goals to brew your coffee"
    />
  );
}
