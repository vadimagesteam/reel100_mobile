import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  SharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import clsx from 'clsx';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 40;
const STROKE_WIDTH = 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface RecordButtonProps {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
  maxDurationSeconds?: number;
  zoom: SharedValue<number>;
}

export const RecordButton = ({
  isRecording,
  onStart,
  onStop,
  maxDurationSeconds = 100,
  zoom,
}: RecordButtonProps) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);
  const startY = useSharedValue(0);
  const zoomActive = useSharedValue(false);

  const toggleRecording = () => {
    isRecording ? onStop() : onStart();
  };

  const tapGesture = Gesture.Tap()
    .hitSlop(30)
    .maxDuration(150)
    .onEnd(() => {
      runOnJS(toggleRecording)();
    });

  const longPressAndZoom = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((e) => {
      zoomActive.value = true;
      startY.value = e.absoluteY;
      runOnJS(onStart)();
    })
    .onUpdate((e) => {
      zoom.value = interpolate(startY.value - e.absoluteY, [0, 300], [1, 5], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      runOnJS(onStop)();
    });

  const composed = Gesture.Exclusive(longPressAndZoom, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    width: 80 * scale.value,
    height: 80 * scale.value,
    transform: [{ rotate: '-90deg' }],
  }));

  // svg animations
  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const svgWrapperStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isRecording) {
      scale.value = withSpring(1.2);
      progress.value = withTiming(1, { duration: maxDurationSeconds * 1000 });
    } else {
      progress.value = withTiming(0);
      scale.value = withSpring(1);
    }
  }, [isRecording, maxDurationSeconds, progress, scale]);

  return (
    <View
      className="absolute w-full items-center justify-center"
      style={{ bottom: insets.bottom + 6 }}
    >
      <GestureDetector gesture={composed}>
        <Animated.View
          className={clsx('h-[80px] w-[80px] items-center justify-center rounded-full bg-white/40')}
          style={animatedStyle}
        >
          <Animated.View className="absolute h-[90px] w-[90px]" style={svgWrapperStyles}>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <Svg width={90} height={90} viewBox="0 0 90 90" style={{ position: 'absolute' }}>
              <Circle
                cx="45"
                cy="45"
                r={RADIUS}
                stroke="#ccc"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <AnimatedCircle
                cx="45"
                cy="45"
                r={RADIUS}
                stroke="#ff4444"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>

          <View
            className={clsx(
              'rounded-full',
              isRecording ? 'h-[60px] w-[60px] scale-90 bg-[#ff4444]' : 'h-[65px] w-[65px] bg-red',
            )}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
