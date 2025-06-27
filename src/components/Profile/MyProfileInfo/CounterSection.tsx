import { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface CounterSectionProps extends TouchableOpacityProps {
  label: ReactNode;
  count: number;
}

const CounterSection = ({ label, count, ...props }: CounterSectionProps) => {
  return (
    <TouchableOpacity className="h-full flex-1 items-center justify-center" {...props}>
      <Text className="text-[20px] font-bold text-silver3">{count}</Text>
      <Text className="mt-[3px] text-[16px] font-medium text-silver3">{label}</Text>
    </TouchableOpacity>
  );
};

export default CounterSection;
