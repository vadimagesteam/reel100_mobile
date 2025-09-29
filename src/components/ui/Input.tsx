import { TextInput, TextInputProps, View, TouchableOpacity, Text } from 'react-native';
import {
  FC,
  forwardRef,
  useState,
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import clsx from 'clsx';
import { SvgIcon } from './SvgIcon';

export interface InputProps extends TextInputProps {
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
  secureToggle?: boolean;
  hasError?: boolean;
  InputComponent?: ComponentType<TextInputProps>;
}

export const Input: FC<InputProps> = forwardRef<TextInput, InputProps>(
  (
    {
      className = '',
      hasError,
      clearable,
      onClear,
      secureToggle,
      secureTextEntry,
      onFocus,
      onBlur,
      InputComponent,
      ...rest
    },
    ref,
  ) => {
    const [secure, setSecure] = useState(!!secureTextEntry);
    const [hasValue, setHasValue] = useState('value' in rest && !!rest.value);
    const [focused, setFocused] = useState(false);

    const _TextInput = (InputComponent ?? TextInput) as ForwardRefExoticComponent<
      TextInputProps & RefAttributes<TextInput>
    >;

    return (
      <View className="relative">
        <_TextInput
          ref={ref}
          autoCapitalize="none"
          placeholderTextColor="#999"
          secureTextEntry={secureToggle ? secure : secureTextEntry}
          textAlignVertical="top"
          className={clsx(
            'rounded-xl border-2 bg-black5 p-[13px] pr-10 text-xl leading-[20px] text-primary',
            !focused && !hasError ? 'border-black5' : '',
            focused && 'border-white',
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
          <TouchableOpacity onPress={() => setSecure((s) => !s)} className="absolute right-4 top-5">
            <SvgIcon image={!secure ? 'eyeShow' : 'eyeHide'} />
          </TouchableOpacity>
        )}

        {clearable && hasValue && (
          <TouchableOpacity onPress={onClear} className="absolute right-3 top-3">
            <Text>X</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
