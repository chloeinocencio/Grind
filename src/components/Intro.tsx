import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import { fonts } from '@/theme';

export const INTRO_BG = '#452829';
const CREAM = '#F8F4D4';

/**
 * Cup width on screen, in points. Must match `imageWidth` for expo-splash-screen
 * in app.json so the native launch screen and the first frame line up exactly.
 */
export const CUP_WIDTH = 260;

// Layer boxes in the artwork's own units (the cup + lid + straw group is 771.3 wide).
const ART_W = 771.3;
const ART_H = 1366;
const k = CUP_WIDTH / ART_W;

const lid = { src: require('../../assets/intro/lid.png'), x: 0, y: 0, w: 771.3, h: 447.3 };
const cup = { src: require('../../assets/intro/cup.png'), x: 30.7, y: 435.7, w: 709.7, h: 930.3 };

// Drop order spells it out: G, R, I, N, D. `spin` is the extra tumble while falling.
const cubes = [
  { key: 'G', src: require('../../assets/intro/G.png'), x: 156.4, y: 524.4, w: 196.3, h: 222.7, spin: -28 },
  { key: 'R', src: require('../../assets/intro/R.png'), x: 251.7, y: 736.7, w: 214.7, h: 251.7, spin: 24 },
  { key: 'I', src: require('../../assets/intro/I.png'), x: 422.7, y: 639.7, w: 192.0, h: 209.7, spin: -36 },
  { key: 'N', src: require('../../assets/intro/N.png'), x: 412.0, y: 922.0, w: 214.7, h: 244.7, spin: 30 },
  { key: 'D', src: require('../../assets/intro/D.png'), x: 202.4, y: 990.0, w: 192.0, h: 228.7, spin: -22 },
];

const box = (b: { x: number; y: number; w: number; h: number }) => ({
  position: 'absolute' as const,
  left: b.x * k,
  top: b.y * k,
  width: b.w * k,
  height: b.h * k,
});

const native = Platform.OS !== 'web';

/** Opening animation: the lid lifts, the G-R-I-N-D cubes drop in, the lid goes back on. */
export function Intro({ onDone }: { onDone: () => void }) {
  const lift = useRef(new Animated.Value(0)).current;
  const drops = useRef(cubes.map(() => new Animated.Value(1))).current;
  const fade = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0.5)).current;
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: native }).start(() => onDone());
  };

  useEffect(() => {
    let cancelled = false;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: native }),
        Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: native }),
      ]),
    );
    loop.start();

    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          drops.forEach((d) => d.setValue(0));
          setTimeout(finish, 800);
          return;
        }
        Animated.sequence([
          Animated.delay(250),
          Animated.timing(lift, { toValue: 1, duration: 520, easing: Easing.out(Easing.back(1.6)), useNativeDriver: native }),
          Animated.stagger(
            190,
            drops.map((d) =>
              Animated.spring(d, {
                toValue: 0,
                friction: 7,
                tension: 70,
                restSpeedThreshold: 0.08,
                restDisplacementThreshold: 0.01,
                useNativeDriver: native,
              }),
            ),
          ),
          Animated.delay(120),
          Animated.timing(lift, { toValue: 0, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: native }),
          Animated.delay(450),
        ]).start(({ finished: ok }) => ok && finish());
      });

    return () => {
      cancelled = true;
      loop.stop();
    };
  }, []);

  const lidStyle = {
    transform: [
      { translateX: lift.interpolate({ inputRange: [0, 1], outputRange: [0, 46] }) },
      { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -150] }) },
      { rotate: lift.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '16deg'] }) },
    ],
  };

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <Pressable
        style={styles.fill}
        onPress={finish}
        accessibilityRole="button"
        accessibilityLabel="Grind is loading. Tap to skip."
      >
        <View style={{ width: ART_W * k, height: ART_H * k }}>
          <Animated.Image source={cup.src} style={box(cup)} resizeMode="stretch" />
          <Animated.Image source={lid.src} style={[box(lid), lidStyle]} resizeMode="stretch" />
          {cubes.map((c, i) => {
            const fall = c.y * k + 360; // start well above the cup
            const d = drops[i];
            return (
              <Animated.Image
                key={c.key}
                source={c.src}
                resizeMode="stretch"
                style={[
                  box(c),
                  {
                    opacity: d.interpolate({ inputRange: [-1, 0.95, 1], outputRange: [1, 1, 0], extrapolate: 'clamp' }),
                    transform: [
                      { translateY: d.interpolate({ inputRange: [-1, 1], outputRange: [fall, -fall] }) },
                      { rotate: d.interpolate({ inputRange: [-1, 1], outputRange: [`${-c.spin}deg`, `${c.spin}deg`] }) },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>
        <Animated.Text style={[styles.label, { opacity: pulse }]}>preparing…</Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: INTRO_BG, zIndex: 100 },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: {
    position: 'absolute',
    bottom: '10%',
    fontFamily: fonts.mono,
    fontSize: 18,
    color: CREAM,
    letterSpacing: 0.5,
  },
});
