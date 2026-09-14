import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { colors } from '../../theme';
import { formatTimeAgo } from '../../utils';
import { Avatar } from '../ui';
import { SvgIcon } from '../ui';
import { getDisplayName } from '../../state/user/utils';
import { getNotificationDisplay } from './notificationDisplay';
import { NotificationItem } from './types';

export interface NotificationRowProps {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  onDelete: (item: NotificationItem) => void;
}

/**
 * One notification card: a circular type icon over the actor's avatar, a bold
 * title line, a muted subtitle + relative time, an unread dot, and a chevron.
 * Swipe left to reveal Delete. Unread rows read as slightly brighter surface.
 *
 * System notifications ("Your rush is ready", "You hit the Top 100") have no
 * actor, so there is no avatar to draw. They show the type icon on its own
 * rather than an initials bubble — the placeholder used to fall back to the
 * letter R, which read as a person named R having done something.
 */
export const NotificationRow = ({ item, onPress, onDelete }: NotificationRowProps) => {
  const swipeRef = useRef<SwipeableMethods>(null);
  const { icon, title, subtitle } = getNotificationDisplay(item);

  const renderDelete = () => (
    <TouchableOpacity
      onPress={() => {
        swipeRef.current?.close();
        onDelete(item);
      }}
      className="my-1 ml-2 items-center justify-center rounded-[14px] bg-red-600 px-5"
    >
      <Text className="font-semibold text-white">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderDelete}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(item)}
        className={`my-1 flex-row items-center gap-3 rounded-[14px] p-3 ${
          item.read ? 'bg-surface' : 'bg-input'
        }`}
      >
        {/* The system-notification circle is bg-graphite, not bg-input: unread
            cards already use bg-input as their own background. */}
        {item.actor ? (
          <View className="relative">
            <Avatar size={44} name={getDisplayName(item.actor)} uri={item.actor.avatar} />
            <View className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border border-background bg-surface">
              <SvgIcon image={icon} color={colors.white} style={styles.typeIcon} />
            </View>
          </View>
        ) : (
          <View className="h-11 w-11 items-center justify-center rounded-full bg-graphite">
            <SvgIcon image={icon} color={colors.white} style={styles.systemIcon} />
          </View>
        )}

        <View className="flex-1">
          <Text className="font-bold text-silver1" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-silver4" numberOfLines={2}>
            {subtitle}
          </Text>
          <Text className="mt-0.5 text-[11px] text-silver5">{formatTimeAgo(item.createdAt)}</Text>
        </View>

        {!item.read && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  typeIcon: { width: 11, height: 11 },
  systemIcon: { width: 20, height: 20 },
});
