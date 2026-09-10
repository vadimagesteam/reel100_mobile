import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useUiStore } from '../../state/app/uiStore';
import { useIsAuthenticated } from '../../state/user/authStore';
import { MenuContent } from './MenuContent';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DRAWER_ANIMATION_MS = 200;

export const DrawerMenuWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { width } = useWindowDimensions();
  const drawerWidth = Math.round(width * 0.75);

  const { menuOpened, actions } = useUiStore();

  const translateX = useSharedValue(drawerWidth);

  // `menuOpened` is the single source of truth. The drawer position is derived
  // from it, and the overlay below is mounted from it too, so the layer's
  // visibility and its ability to receive touches can never disagree.
  //
  // The previous implementation kept a separate `active` shared value and
  // synced it to the store both ways (useEffect down, useAnimatedReaction +
  // runOnJS up). Opacity was driven by translateX on the UI thread while
  // pointerEvents was driven by menuOpened on the JS thread, so a missed round
  // trip left an invisible but tap-absorbing overlay across the whole app until
  // restart. See the "taps stop registering app-wide" bug.
  useEffect(() => {
    translateX.value = withTiming(menuOpened ? 0 : drawerWidth, {
      duration: DRAWER_ANIMATION_MS,
    });
  }, [drawerWidth, menuOpened, translateX]);

  // The overlay outlives `menuOpened` by exactly one animation so the scrim can
  // fade out instead of popping. Deliberately a plain JS timeout rather than a
  // withTiming completion callback: callbacks on interrupted animations are the
  // fragility this rewrite exists to remove. Because the effect re-runs on every
  // render while `menuOpened` is false, the unmount cannot be missed — the worst
  // case is that it is rescheduled, never that it is skipped.
  const [overlayMounted, setOverlayMounted] = useState(menuOpened);

  useEffect(() => {
    if (menuOpened) {
      setOverlayMounted(true);
      return;
    }

    const timeout = setTimeout(() => setOverlayMounted(false), DRAWER_ANIMATION_MS);
    return () => clearTimeout(timeout);
  }, [menuOpened]);

  const closeMenu = useMemo(() => () => actions.setMenuOpened(false), [actions]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          // Dragging right (positive translation) closes; the closed position
          // is +drawerWidth since the drawer sits on the right edge.
          translateX.value = withSpring(Math.max(0, e.translationX), {
            damping: 100,
            stiffness: 400,
          });
        })
        .onEnd((e) => {
          const shouldClose = e.velocityX > 1000 || e.translationX > drawerWidth / 2;

          if (shouldClose) {
            // Hand the state change to the store and let the effect above drive
            // the animation, so position and mount state stay in lockstep.
            runOnJS(closeMenu)();
            return;
          }

          translateX.value = withTiming(0, { duration: DRAWER_ANIMATION_MS });
        }),
    [closeMenu, drawerWidth, translateX],
  );

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [drawerWidth, 0], [0, 0.9], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const containerTranslateX = interpolate(
      translateX.value,
      [drawerWidth, 0],
      [0, -100],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX: containerTranslateX }],
    };
  });

  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated) {
    return children;
  }

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          className="absolute bottom-0 right-0 top-0 z-[11] flex-1"
          style={[{ width: drawerWidth }, drawerStyle]}
        >
          <MenuContent />
        </Animated.View>
      </GestureDetector>
      {overlayMounted && (
        <AnimatedPressable
          onPress={closeMenu}
          className="absolute inset-0 z-[10] bg-black/80"
          style={overlayStyle}
        />
      )}
      <Animated.View className="flex-1" style={contentStyle}>
        {children}
      </Animated.View>
    </>
  );
};
