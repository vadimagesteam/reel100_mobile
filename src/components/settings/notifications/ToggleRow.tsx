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
      <Text className="text-primary flex-1 pr-4 text-base">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor="#ffffff"
        trackColor={{ true: colors.blue2, false: '#3a3a3c' }}
      />
    </View>
    {description && <Text className="text-primary/50 mt-2 text-sm">{description}</Text>}
  </View>
);
