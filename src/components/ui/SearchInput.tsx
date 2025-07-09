import clsx from 'clsx';
import { ComponentType } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { isAndroid } from '../../utils';
import { IonIconType } from './IonIconTypes';

export interface SearchInputProps extends TextInputProps {
  className?: string;
  wrapperClassName?: string;
  onClear?: () => void;
  TextInputComponent?: ComponentType<TextInputProps>;
  icon?: IonIconType;
}

export const SearchInput = ({
  value,
  className,
  wrapperClassName,
  onChangeText,
  onClear,
  icon = 'search',
  placeholder = 'Search',
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
      <Ionicons name={icon} size={18} color="#aaa" />
      <TextInputComponent
        hitSlop={{ top: 8, bottom: 8 }}
        className={clsx('flex-1 px-2 text-white', isAndroid && 'h-12', className)}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardAppearance="dark"
        returnKeyType="search"
        textAlignVertical="center"
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
