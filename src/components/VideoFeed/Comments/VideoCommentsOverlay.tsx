import {
  useVideoActions,
  useVideoPlayerStore,
} from '../../../state/videoPlayer/videoVideoPlayerStore.ts';
import { CommentsBottomSheet } from './CommentsBottomSheet.tsx';
import { Pressable } from 'react-native';

export const VideoCommentsOverlay = () => {
  const commentsOpened = useVideoPlayerStore((s) => s.commentsOpened);
  const { closeComments } = useVideoActions();

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
