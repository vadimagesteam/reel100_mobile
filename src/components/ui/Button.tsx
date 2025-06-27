import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'outline' | 'danger' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  textClassName?: string;
  buttonClassName?: string;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  gradientColors?: string[];
}

const variants: Record<string, string> = {
  primary: 'bg-blue1',
  outline: 'border border-blue1 bg-transparent',
  danger: 'bg-red',
  gradient: '', // no bg for gradient, handled separately
  ghost: '',
};

const textVariants: Record<string, string> = {
  primary: 'text-white',
  outline: 'text-green',
  danger: 'text-white',
  gradient: 'text-white',
  ghost: 'text-white',
};

const sizes: Record<string, string> = {
  sm: 'py-2 px-3',
  md: 'py-3 px-4',
  lg: 'py-4 px-5',
};

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  loading,
  loadingText,
  textClassName,
  buttonClassName,
  children,
  disabled,
  iconLeft,
  iconRight,
  gradientColors,
  ...rest
}) => {
  const baseButton = 'rounded-xl items-center justify-center flex-row overflow-hidden';

  const isDisabled = disabled || loading;

  const content = loading ? (
    loadingText ? (
      <Text className={clsx('font-bold', textVariants[variant], textSizes[size], textClassName)}>
        {loadingText}
      </Text>
    ) : (
      <ActivityIndicator color="white" size="small" />
    )
  ) : (
    <View className="flex-row items-center gap-x-2">
      {iconLeft}
      <Text className={clsx('font-bold', textVariants[variant], textSizes[size], textClassName)}>
        {children}
      </Text>
      {iconRight}
    </View>
  );
  console.log(
    'BTN TEXT CLASSNAME',
    clsx('font-bold', textVariants[variant], textSizes[size], textClassName),
  );

  const gradient = (
    <View className={clsx(baseButton, variants[variant], sizes[size], buttonClassName)}>
      <LinearGradient
        start={{ x: 0.1, y: 0.5 }}
        end={{ x: 0.9, y: 0 }}
        colors={gradientColors ?? ['#39bdc5', '#2140a1']}
        style={{ flex: 1 }}
      >
        {content}
      </LinearGradient>
    </View>
  );

  return (
    <TouchableOpacity disabled={isDisabled} activeOpacity={0.85} {...rest}>
      {variant === 'gradient' ? (
        gradient
      ) : (
        <View className={clsx(baseButton, variants[variant], sizes[size], buttonClassName)}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};
