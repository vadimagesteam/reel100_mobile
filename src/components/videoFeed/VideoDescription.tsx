import React, { memo, useState } from 'react';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GestureTouchableOpacity } from './GestureTouchableOpacity';
import { Text, useWindowDimensions } from 'react-native';

export interface VideoDescriptionProps {
  text: string;
  bottomInset: number;
  backdropActive: SharedValue<boolean>;
}

export const VideoDescription = memo(
  ({ text, backdropActive: active, bottomInset }: VideoDescriptionProps) => {
    const dimensions = useWindowDimensions();
    const [hasMore, setHasMore] = useState(false);

    const shortTextStyle = useAnimatedStyle(() => {
      return {
        display: active.value ? 'none' : 'flex',
        opacity: withTiming(active.value ? 0 : 1),
      };
    });

    const longTextStyle = useAnimatedStyle(() => {
      return {
        display: active.value ? 'flex' : 'none',
        opacity: withTiming(active.value ? 1 : 0),
      };
    });

    const test = useAnimatedStyle(() => {
      return {
        position: active.value ? 'absolute' : 'relative',
        left: withTiming(active.value ? 10 : 0),
      };
    });

    const textToMeasure = 'Hello World Example Text';

    return (
      <GestureTouchableOpacity
        hitSlop={{ top: 10 }}
        className="z-30 w-[80%] flex-col items-start justify-center"
        style={[{ bottom: bottomInset }, test]}
        onPress={() => {
          if (hasMore) {
            active.value = !active.value;
          }
        }}
        activeOpacity={0.8}
      >
        {/* Measure text size */}
        <Text
          className="text-[13px] font-bold text-primary opacity-0"
          onLayout={(e) => {
            const approxOneChar = e.nativeEvent.layout.width / textToMeasure.length;
            // Max size of the text container is 80%
            // So we can check approximately
            const containerPaddingLeft = 10;
            setHasMore(
              approxOneChar * text.length >= (dimensions.width - containerPaddingLeft * 2) * 0.8,
            );
          }}
        >
          {textToMeasure}
        </Text>

        <Animated.Text
          style={shortTextStyle}
          className="text-[13px] font-bold text-primary"
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
        <Animated.Text style={longTextStyle} className="text-[13px] font-medium text-primary">
          {text}
        </Animated.Text>
      </GestureTouchableOpacity>
    );
  },
);
