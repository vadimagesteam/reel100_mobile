import { SvgIconsNames } from '../../assets/icons/typesSvg';
import { getDisplayName } from '../../state/user/utils';
import { NotificationItem } from './types';

export type NotificationDisplay = {
  icon: SvgIconsNames;
  title: string;
  subtitle: string;
};

/**
 * Per-type icon and copy for the notification rows. The mock is only a
 * reference; this uses the app's own icon set and voice. Actor-driven types
 * lead with the actor's name (bold title) and describe the action (muted
 * subtitle); system types (video processed, top 100) have no actor.
 */
export const getNotificationDisplay = (item: NotificationItem): NotificationDisplay => {
  const actor = item.actor ? getDisplayName(item.actor) : 'Someone';

  switch (item.type) {
    case 'Like':
      return { icon: 'like_red_heart', title: actor, subtitle: 'loved your rush' };
    case 'CommentLike':
      return { icon: 'like_red_heart', title: actor, subtitle: 'liked your comment' };
    case 'Comment':
      return { icon: 'commentIcon', title: actor, subtitle: 'commented on your rush' };
    case 'Follow':
      return { icon: 'profileNavTab', title: actor, subtitle: 'started following you' };
    case 'Message':
      return { icon: 'commentIcon', title: actor, subtitle: 'sent you a message' };
    case 'VideoProcessed':
      return {
        icon: 'playIcon',
        title: 'Your rush is ready',
        subtitle: 'Your upload finished processing',
      };
    case 'Top100':
      return {
        icon: 'top100Tab',
        title: 'You hit the Top 100!',
        subtitle:
          item.payload?.position != null
            ? `Your rush reached #${item.payload.position}`
            : 'Your rush reached the Top 100',
      };
    default:
      return { icon: 'like_red_heart', title: actor, subtitle: 'sent you a notification' };
  }
};
