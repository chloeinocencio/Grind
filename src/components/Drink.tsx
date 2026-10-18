import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  /** 0..1 — how full the glass is. */
  level: number;
  width: number;
  aspect: number; // height / width of the art
};

/**
 * The full drink is drawn twice: a faint "empty glass" underneath, and the real
 * art clipped from the bottom up to the current level, so the glass looks like
 * it's being poured as goals get checked off.
 */
export function Drink({ source, level, width, aspect }: Props) {
  const height = width * aspect;
  const fill = useRef(new Animated.Value(level)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: Math.max(0, Math.min(1, level)),
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [level, fill]);

  const clipHeight = fill.interpolate({ inputRange: [0, 1], outputRange: [0, height] });

  return (
    <View
      style={{ width, height }}
      accessible
      accessibilityLabel={`Drink ${Math.round(level * 100)} percent full`}
    >
      <Image source={source} style={[styles.empty, { width, height }]} resizeMode="contain" />
      <Animated.View style={[styles.clip, { height: clipHeight }]}>
        <Image source={source} style={{ width, height, position: 'absolute', bottom: 0 }} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { position: 'absolute', top: 0, left: 0, opacity: 0.16 },
  clip: { position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden' },
});
