import Ionicons from '@react-native-vector-icons/ionicons';
import { Alert, Share } from 'react-native';
import { colors } from '../../theme';
import { CircleIconButton } from '../ui';
import { buildTagLink } from './tagLink';

export interface TagShareButtonProps {
  tags: string[];
  /** Already formatted as "#oregon + #fishing". */
  title: string;
}

/**
 * Shares the hashtag page. Uses the OS share sheet rather than the in-app
 * one: the in-app sheet sends a video to another user in chat, which is a
 * different thing from passing a link to a page around.
 */
export const TagShareButton = ({ tags, title }: TagShareButtonProps) => {
  const handleShare = async () => {
    if (tags.length === 0) {
      return;
    }
    try {
      await Share.share({
        message: `${title} on RushRanks\n${buildTagLink(tags)}`,
      });
    } catch (error) {
      // Dismissing the sheet is not a failure; anything else is worth saying.
      if (error instanceof Error && error.message) {
        Alert.alert('Couldn’t share', error.message);
      }
    }
  };

  return (
    <CircleIconButton size={36} onPress={handleShare}>
      <Ionicons name="share-social-outline" size={20} color={colors.primary} />
    </CircleIconButton>
  );
};
