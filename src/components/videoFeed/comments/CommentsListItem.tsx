import clsx from 'clsx';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { useNavigation } from '../../../navigation';
import { Screens } from '../../../navigation/screens';
import { getDisplayName } from '../../../state/user/utils';
import { Avatar } from '../../ui';
import { CommentType } from './hooks/useCommentsInfiniteQuery';
import { formatTimeAgo } from '../../../utils';

export interface CommentListItemProps<T = CommentType> extends Pick<ViewProps, 'onLayout'> {
  comment: T;
  onReplyPress?: (comment: T) => void;
  onToggleReplies?: (comment: T) => void;
}

export const CommentsListItem = ({
  comment: item,
  onReplyPress,
  onToggleReplies,
  onLayout,
}: CommentListItemProps) => {
  const { user } = item;
  const navigation = useNavigation();
  const fullName = getDisplayName(user);

  return (
    <View className={clsx('mt-[10px]', item.replyTo && 'ml-[20px]')} onLayout={onLayout}>
      <View className="flex-row justify-between rounded-[10] bg-surface p-[10px]">
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(Screens.Profile, {
                user,
              });
            }}
            className="flex-row"
          >
            <Avatar size={30} name={fullName} uri={user.avatar} />
            <Text className="ml-[5px] text-[16px] font-bold text-silver4">{fullName}</Text>
          </TouchableOpacity>
          <View className="ml-[36px]">
            <Text className="text-silver1">{item.text}</Text>
          </View>
        </View>
        <Text className="text-[9px] text-primary">
          {item.id.startsWith('optimistic') ? 'sending...' : formatTimeAgo(item.createdAt)}
        </Text>
      </View>

      {!item.replyTo && (
        <View className="flex-row items-center justify-between">
          <TouchableOpacity hitSlop={20} onPress={() => onReplyPress?.(item)}>
            <Text className="text-primary">Reply</Text>
          </TouchableOpacity>
          {item.repliesCount > 0 && (
            <TouchableOpacity
              hitSlop={20}
              onPress={() => onToggleReplies?.(item)}
              className="flex-row items-center"
            >
              <Text className="ml-1 mt-1 text-silver4">view {item.repliesCount} replies</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
