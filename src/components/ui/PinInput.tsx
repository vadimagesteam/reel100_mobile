import React, { useCallback, useMemo, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface PinInputProps {
  code: string;
  size: number;
  setCode: (val: string) => void;
}

export const PinInput = ({ code, size, setCode }: PinInputProps) => {
  const inputRef = useRef<TextInput>(null);

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const codeSquares = useMemo(
    () =>
      Array.from({ length: size }).map((_, index) => (
        <View
          key={index}
          className="mx-[5px] size-[50px] items-center justify-center rounded-[10px] border-[2px] border-silver1 bg-white"
        >
          <Text className="text-2xl font-bold">{code[index] || ''}</Text>
        </View>
      )),
    [code, size],
  );

  return (
    <>
      <TextInput
        ref={inputRef}
        testID="pin-input"
        className="absolute h-[1px] w-[1px] opacity-0"
        keyboardType="numeric"
        maxLength={size}
        value={code}
        onChangeText={setCode}
        autoFocus
      />
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-row justify-center"
        onPress={handlePress}
      >
        {codeSquares}
      </TouchableOpacity>
    </>
  );
};
