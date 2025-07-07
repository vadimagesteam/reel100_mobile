import clsx from 'clsx';
import { ComponentType } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export interface SearchInputProps extends TextInputProps {
  className?: string;
  wrapperClassName?: string;
  onClear?: () => void;
  TextInputComponent?: ComponentType<TextInputProps>;
}

export const SearchInput = ({
  value,
  className,
  wrapperClassName,
  onChangeText,
  onClear,
  TextInputComponent = TextInput,
  ...textInputProps
}: SearchInputProps) => {
  return (
    <View
      className={clsx(
        'h-10 grow flex-row items-center rounded-lg bg-zinc-800 px-3',
        wrapperClassName,
      )}
    >
      <Ionicons name="search" size={18} color="#aaa" />
      <TextInputComponent
        hitSlop={{ top: 8, bottom: 8 }}
        className={clsx('flex-1 px-2 text-white', className)}
        placeholder="Search..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardAppearance="dark"
        returnKeyType="search"
        {...textInputProps}
      />
      {!!value && (
        <TouchableOpacity
          hitSlop={10}
          onPress={() => {
            onChangeText?.('');
            onClear?.();
          }}
        >
          <Ionicons name="close-circle" size={18} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
};
