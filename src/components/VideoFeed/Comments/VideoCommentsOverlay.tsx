import { Pressable } from 'react-native';
import { CommentsBottomSheet } from './CommentsBottomSheet.tsx';
import { useVideoFeed } from '../hooks/useVideoFeed.ts';

export const VideoCommentsOverlay = () => {
  const commentsOpened = useVideoFeed((s) => s.commentsOpened);
  const { closeComments } = useVideoFeed((s) => s.actions);

  const isOpened = !!commentsOpened;

  return (
    <>
      {isOpened && (
        <Pressable
          onPress={closeComments}
          collapsable={false}
          className="absolute inset-x-0 inset-y-0"
        />
      )}
      <CommentsBottomSheet
        open={isOpened}
        videoId={commentsOpened?.videoId!}
        onClose={closeComments}
      />
    </>
  );
};
