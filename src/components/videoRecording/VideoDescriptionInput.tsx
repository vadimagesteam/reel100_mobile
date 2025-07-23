import React, { useRef, useState } from 'react';
import { TextInput, useWindowDimensions, TextStyle, Pressable, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme';
import { Backdrop } from '../ui';

export interface VideoDescriptionInputProps {
  value: string;
  setValue: (value: string) => void;
}

const DescriptionMaxLength = 600;

export const VideoDescriptionInput = ({ value, setValue }: VideoDescriptionInputProps) => {
  const dimensions = useWindowDimensions();
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const animationStyle = useAnimatedStyle(() => {
    const width = focused ? dimensions.width * 0.94 : 160;
    const height = focused ? 100 : 40;
    const bottom = focused ? 370 : 160;

    return {
      left: withTiming(dimensions.width / 2 - width / 2),
      bottom: withTiming(bottom),
      height: withTiming(height),
      width: withTiming(width),
    };
  });

  const backdropActive = useSharedValue(false);
  const setFocusedValue = (value: boolean) => {
    setFocused(value);
    backdropActive.value = value;
  };

  return (
    <>
      <Backdrop active={backdropActive} onPress={() => inputRef.current?.blur()} />
      <Animated.View className="absolute z-[11]" style={animationStyle}>
        <TextInput
          ref={inputRef}
          multiline
          // keyboardType="twitter"
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          keyboardAppearance="dark"
          numberOfLines={focused ? 10 : 1}
          maxLength={DescriptionMaxLength}
          className="size-full rounded-xl bg-[#d2d4db] p-3 text-black"
          style={
            {
              textAlign: focused ? 'left' : 'center',
              textAlignVertical: focused ? 'top' : 'center',
            } as TextStyle
          }
          placeholderTextColor={colors.graphite}
          onFocus={() => {
            setFocusedValue(true);
          }}
          onBlur={() => {
            setFocusedValue(false);
          }}
          value={value}
          onChangeText={setValue}
          placeholder="Video Description"
        />
        {!focused && (
          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="absolute size-full items-center justify-center rounded-xl bg-[#d2d4db] p-3 text-black"
          >
            <Text numberOfLines={1} ellipsizeMode="tail">
              {value || 'Video Description'}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </>
  );
};
