import { Switch, Text, View } from 'react-native';
import { colors } from '../../../theme/colors.ts';

export const ToggleRow = ({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) => (
  <View className="px-4 py-4">
    <View className="flex-row items-center justify-between">
      <Text className="flex-1 pr-4 text-base text-white">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor="#ffffff"
        trackColor={{ true: colors.blue2, false: '#3a3a3c' }}
      />
    </View>
    {description && <Text className="mt-2 text-sm text-white/50">{description}</Text>}
  </View>
);
