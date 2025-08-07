import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { LinearGradient } from './LinearGradient';

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
  primary: 'bg-button-primary',
  outline: 'border border-button-primary bg-transparent',
  danger: 'bg-button-danger',
  gradient: '', // no bg for gradient, handled separately
  ghost: '',
};

const textVariants: Record<string, string> = {
  primary: 'button-primary-text',
  outline: 'text-primary',
  danger: 'text-primary',
  gradient: 'text-primary',
  ghost: 'text-primary',
};

const sizes: Record<string, string> = {
  sm: 'h-[30px] py-2 px-3',
  md: 'h-[40px] py-3 px-4',
  lg: 'h-[52px] py-4 px-5',
};

const textSizes: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-[13px]',
  lg: 'text-lg',
};

const variantLoaderColors: Record<string, string | undefined> = {
  danger: '#fff',
};

export const Button = ({
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
}: ButtonProps) => {
  const baseButton = 'rounded-xl items-center justify-center flex-row overflow-hidden';

  const isDisabled = disabled || loading;

  const content = loading ? (
    loadingText ? (
      <Text className={clsx('font-bold', textVariants[variant], textSizes[size], textClassName)}>
        {loadingText}
      </Text>
    ) : (
      <ActivityIndicator size="small" color={variantLoaderColors[variant]} />
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

  const gradient = (
    <LinearGradient
      start={{ x: 0.1, y: 0.5 }}
      end={{ x: 0.9, y: 0 }}
      colors={gradientColors ?? ['#39bdc5', '#2140a1']}
      className="rounded-[6px]"
    >
      <View className={clsx(baseButton, variants[variant], sizes[size], buttonClassName)}>
        {content}
      </View>
    </LinearGradient>
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
