import { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import clsx from 'clsx';

export interface CounterSectionProps extends TouchableOpacityProps {
  label: ReactNode;
  count: number;
}

const CounterSection = ({ label, className, count, ...props }: CounterSectionProps) => {
  return (
    <TouchableOpacity
      className={clsx('h-full flex-1 items-center justify-center', className)}
      {...props}
    >
      <Text className="text-[20px] font-bold text-silver3">{count}</Text>
      <Text className="mt-[3px] text-[16px] font-medium text-silver3">{label}</Text>
    </TouchableOpacity>
  );
};

export default CounterSection;
