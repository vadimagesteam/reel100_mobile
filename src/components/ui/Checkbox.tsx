import clsx from 'clsx';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface CheckboxProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string | ReactNode;
}

export function Checkbox({ value, onChange, label }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      className="flex-row items-center gap-2 py-2"
      activeOpacity={0.8}
    >
      <View
        className={clsx(
          'h-5 w-5 items-center justify-center rounded border border-neutral-500',
          value && 'border-blue2 bg-blue2',
        )}
      >
        {value && <View className="h-2.5 w-2.5 rounded bg-white" />}
      </View>
      {typeof label === 'string' ? <Text className="text-base text-primary">{label}</Text> : label}
    </TouchableOpacity>
  );
}
