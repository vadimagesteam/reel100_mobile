import { TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '../../navigation';
import { Screens } from '../../navigation/screens';
import { colors } from '../../theme';
import { useUnreadNotificationsCount } from './hooks/useNotificationsApi';

const BellIcon = ({ color = colors.white, size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2a6 6 0 0 0-6 6c0 3.5-.8 5.5-1.7 6.7-.5.7 0 1.8.9 1.8h13.6c.9 0 1.4-1.1.9-1.8C18.8 13.5 18 11.5 18 8a6 6 0 0 0-6-6Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 20a2.5 2.5 0 0 0 5 0"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Header bell that opens the notification center. Shows a small unread dot
 * (matching the mock, which uses a dot rather than a number). The count comes
 * from the shared unread query, which refreshes on app foreground.
 */
export const NotificationBellButton = () => {
  const navigation = useNavigation();
  const { data: unread } = useUnreadNotificationsCount();
  const hasUnread = (unread ?? 0) > 0;

  return (
    <TouchableOpacity
      hitSlop={{ left: 10, top: 10, bottom: 10, right: 10 }}
      onPress={() => navigation.navigate(Screens.Notifications)}
    >
      <View>
        <BellIcon />
        {hasUnread && (
          <View className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-background bg-primary" />
        )}
      </View>
    </TouchableOpacity>
  );
};
