import { TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { FC, forwardRef, useState } from 'react';
import clsx from 'clsx';
import SvgIcon from './SvgIcon.tsx';

export interface InputProps extends TextInputProps {
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
  secureToggle?: boolean;
  hasError?: boolean;
}

export const Input: FC<InputProps> = forwardRef<TextInput, InputProps>(
  ({ className = '', hasError, clearable, onClear, secureToggle, secureTextEntry, onFocus, onBlur, ...rest }, ref) => {
    const [secure, setSecure] = useState(!!secureTextEntry);
    const [hasValue, setHasValue] = useState('value' in rest && !!rest.value);
    const [focused, setFocused] = useState(false);

    return (
      <View className="relative">
        <TextInput
          ref={ref}
          autoCapitalize="none"
          placeholderTextColor="#999"
          secureTextEntry={secureToggle ? secure : secureTextEntry}
          className={clsx(
            'bg-black5 border-2 text-white text-xl p-[13px]  rounded-xl pr-10',
            !focused && !hasError ? 'border-black5' : '',
            focused && 'border-blue1',
            hasError && 'border-red1',
            className,
          )}
          onChangeText={(text) => {
            rest.onChangeText?.(text);
            setHasValue(!!text);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {secureToggle && (
          <TouchableOpacity
            onPress={() => setSecure((s) => !s)}
            className="absolute right-4 top-5"
          >
            <SvgIcon image={!secure ? 'eyeShow' : 'eyeHide'} />
          </TouchableOpacity>
        )}

        {clearable && hasValue && (
          <TouchableOpacity
            onPress={onClear}
            className="absolute right-3 top-3"
          >
            <SvgIcon image="clear" />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
