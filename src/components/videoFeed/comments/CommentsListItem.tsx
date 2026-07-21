import clsx from 'clsx';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { useNavigation } from '../../../navigation';
import { Screens } from '../../../navigation/screens';
import { useUser } from '../../../state/user/authStore';
import { getDisplayName } from '../../../state/user/utils';
import { Avatar } from '../../ui';
import { IconHeart } from '../IconHeart';
import { useLikeMutations } from '../hooks';
import { CommentContextMenu } from './CommentContextMenu';
import { CommentType } from './hooks/useCommentsInfiniteQuery';
import { formatTimeAgo } from '../../../utils';

/**
 * Heart + count for a single comment. Works identically for top-level comments
 * and replies, and for the user's own comments.
 *
 * The comment in the list cache is the single source of truth: likedByMe drives
 * the filled/outline state AND the like-vs-unlike decision, and myReactionId is
 * passed to the unlike so it can DELETE the reaction without depending on a
 * separate cache staying in sync. useLikeMutations keeps both fields current
 * (optimistically on tap, then with the server id on success).
 */
const CommentLikeButton = ({ comment }: { comment: CommentType }) => {
  const { like, unlike } = useLikeMutations();

  const handlePress = () => {
    const common = {
      type: 'comment' as const,
      id: comment.id,
      authorId: comment.user.id,
      videoId: comment.video.id,
    };
    if (comment.likedByMe) {
      unlike.mutate({ ...common, reactionId: comment.myReactionId ?? undefined });
    } else {
      like.mutate(common);
    }
  };

  return (
    <TouchableOpacity
      hitSlop={20}
      onPress={handlePress}
      // Debounce rapid taps so a like and its unlike can't overlap in flight.
      disabled={like.isPending || unlike.isPending}
      className="flex-row items-center gap-1"
    >
      <IconHeart variant={comment.likedByMe ? 'filled' : 'outline'} width={16} height={16} />
      {comment.likesCount > 0 && (
        <Text className="text-silver4">{comment.likesCount}</Text>
      )}
    </TouchableOpacity>
  );
};

export interface CommentListItemProps<T = CommentType> extends Pick<ViewProps, 'onLayout'> {
  comment: T;
  onReplyPress?: (comment: T) => void;
  onToggleReplies?: (comment: T) => void;
  onDelete?: (comment: T) => void;
}

export const CommentsListItem = ({
  comment: item,
  onReplyPress,
  onToggleReplies,
  onDelete,
  onLayout,
}: CommentListItemProps) => {
  const { user } = item;
  const navigation = useNavigation();
  const fullName = getDisplayName(user);
  const me = useUser();

  const isMyComment = me.id === item.user.id;

  const handleReply = () => onReplyPress?.(item);

  return (
    <CommentContextMenu
      allowDelete={isMyComment}
      onDelete={() => onDelete?.(item)}
      onReply={handleReply}
    >
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

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity hitSlop={20} onPress={handleReply}>
              <Text className="text-primary">Reply</Text>
            </TouchableOpacity>
            <CommentLikeButton comment={item} />
          </View>
          {!item.replyTo && item.repliesCount > 0 && (
            <TouchableOpacity
              hitSlop={20}
              onPress={() => onToggleReplies?.(item)}
              className="flex-row items-center"
            >
              <Text className="ml-1 mt-1 text-silver4">view {item.repliesCount} replies</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </CommentContextMenu>
  );
};
