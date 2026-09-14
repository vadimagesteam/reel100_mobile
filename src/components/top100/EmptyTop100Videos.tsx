import Ionicons from '@react-native-vector-icons/ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '../../navigation';
import { Screens, Tabs } from '../../navigation/screens';
import { useStateSelector } from '../../state/app/uiStore';
import { colors } from '../../theme';
import { IonIconType } from '../ui/IonIconTypes';

const CtaRow = ({
  icon,
  label,
  onPress,
}: {
  icon: IonIconType;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-2 w-full flex-row items-center gap-3 rounded-xl border border-zinc-800 bg-input px-4 py-3.5"
  >
    <View className="h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
      <Ionicons name={icon} size={18} color={colors.primary} />
    </View>
    <Text className="flex-1 text-base font-semibold text-primary">{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
  </TouchableOpacity>
);

/**
 * Top 100 empty state: instead of a dead page, routes the user to content via
 * three CTAs (Most Active States, the 4U page, the National Rushchive). Polling
 * in Top100Videos swaps this out as soon as a ranked video appears.
 */
export const EmptyTop100Videos = ({ stateLabel }: { stateLabel?: string }) => {
  const navigation = useNavigation();
  const [selectedState, setSelectedState] = useStateSelector();

  return (
    <Animated.View
      entering={FadeIn.delay(100)}
      className="flex-1 items-center justify-center px-6"
    >
      <View className="w-full max-w-[380px] items-center rounded-3xl border border-zinc-800 bg-surface px-5 py-7">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-input">
          <Ionicons name="play" size={32} color="#9a9a9a" />
        </View>
        <Text className="mb-1 text-center text-xl font-bold text-primary">
          No ranked videos {stateLabel ? `in ${stateLabel} ` : ''}yet today
        </Text>
        <Text className="mb-5 text-center text-sm text-muted">
          Try one of these to start watching
        </Text>

        <CtaRow
          icon="stats-chart"
          label="Most Active States"
          onPress={() =>
            navigation.navigate(Screens.SelectState, {
              placeholderValue: selectedState?.label,
              onSelected: setSelectedState,
            })
          }
        />
        <CtaRow
          icon="person-circle-outline"
          label="4U Page"
          onPress={() =>
            // @ts-expect-error nested tab navigation (see VideoPreview.tsx)
            navigation.navigate('Tabs', { screen: Tabs.TabForYou })
          }
        />
        <CtaRow
          icon="time-outline"
          label="National Rushchive"
          onPress={() =>
            // @ts-expect-error nested tab navigation (see VideoPreview.tsx)
            navigation.navigate('Tabs', { screen: Tabs.TabGlobalVideo })
          }
        />
      </View>
    </Animated.View>
  );
};
