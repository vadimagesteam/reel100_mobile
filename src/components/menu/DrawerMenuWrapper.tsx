import React, { useEffect } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useUiStore } from '../../state/app/uiStore.ts';
import { MenuContent } from './MenuContent.tsx';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DrawerMenuWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { width } = useWindowDimensions();
  const drawerWidth = Math.round(width * 0.75);

  const { menuOpened, actions } = useUiStore();

  const active = useSharedValue(menuOpened);
  const translateX = useSharedValue(-drawerWidth);

  useEffect(() => {
    if (menuOpened !== active.value) {
      active.value = menuOpened;
    }
  }, [active, menuOpened]);

  useAnimatedReaction(
    () => active.value,
    (curr) => {
      if (curr) {
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(-drawerWidth);
      }
      runOnJS(actions.setMenuOpened)(curr);
    },
  );

  const gesture = Gesture.Pan()
    .onChange((e) => {
      console.log('e.translationX', e.translationX);
      if (e.translationX < 0) {
        translateX.value = withSpring(e.translationX, {
          damping: 100,
          stiffness: 400,
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 100,
          stiffness: 400,
        });
      }
    })
    .onEnd((e) => {
      if (e.velocityX < -1000) {
        translateX.value = withTiming(-drawerWidth, { duration: 160 }, () => {
          active.value = false;
        });
      }
      if (e.translationX < -drawerWidth / 2) {
        translateX.value = withTiming(-drawerWidth, { duration: 200 }, () => {
          active.value = false;
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-drawerWidth, 0], [0, 0.9], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const containerTranslateX = interpolate(
      translateX.value,
      [-drawerWidth, 0],
      [0, 100],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: containerTranslateX }],
    };
  });

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute bottom-0 left-0 top-0 z-[11] flex-1"
          style={[{ width: drawerWidth }, drawerStyle]}
        >
          <MenuContent />
        </Animated.View>
      </GestureDetector>
      <AnimatedPressable
        onPress={() => (active.value = false)}
        className="absolute inset-0 z-[10] bg-black/80"
        style={overlayStyle}
      />
      <Animated.View className="flex-1" style={contentStyle}>
        {children}
      </Animated.View>
    </>
  );
};
